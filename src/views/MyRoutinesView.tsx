import { useEffect, useRef, useState, useMemo } from "react"
import { LuPlus, LuTarget, LuTrendingUp } from "react-icons/lu"
import { Button } from "../components/Button"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { FeatureCard } from "../components/FeatureCard"
import { SearchBar } from "../components/SearchBar"
import { CustomSelect } from "../components/CustomSelect"
import { Spinner } from "../components/Spinner"
// import { handleCategoryChange } from "../utils/handleCategoryChange"
import { RoutineCard } from "../components/myRoutines/cards/RoutineCard"
import { RoutineModal } from "../components/myRoutines/modals/RoutineModal"
import { ConfigRoutineModal } from "../components/myRoutines/modals/ConfigRoutineModal"
import { useNavigate } from "react-router-dom"
import type { RutinaResponseDTO } from "../types/rutina/RutinaResponseDTO"
import { useDispatch, useSelector } from "react-redux"
import { fetchRoutines, updateRoutine, deleteRoutine, fetchSavedRoutines } from "../store/slices/routineSlice"
import { fetchCategories } from "../store/slices/categorySlice"
import { startRoutineFromDto } from "../store/slices/trainingSlice"
import { savePublicRoutine } from "../store/slices/communitySlice"
import { fetchAgenda } from "../store/slices/agendaSlice"
import { useAuth0 } from "@auth0/auth0-react"
import { Toast } from "../components/Toast"
import type { RootState } from "../store"
import { ConfirmModal } from "../components/ConfirmModal"

interface RoutineData {
    id: string
    title: string
    level: {
        label: string
        color: 'green' | 'blue' | 'yellow' | 'red' | 'orange'
    }
    category?: string
    exerciseCount: number
    isWeekly: boolean
    weeklyData?: {
        duration: string
        activeDays: string[]
        lastCompleted?: string
    }
    simpleData?: {
        lastCompleted?: string
    }
}

export const MyRoutinesView = () => {
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedDifficulty, setSelectedDifficulty] = useState("")
    const [selectedType, setSelectedType] = useState("simple")
    const [searchTerm, setSearchTerm] = useState("")
    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false)
    const [selectedRoutine, setSelectedRoutine] = useState<RoutineData | null>(null)
    const [isConfigRoutineModalOpen, setIsConfigRoutineModalOpen] = useState(false)
    const [editPrefill, setEditPrefill] = useState<any | null>(null)
    const [editRoutineId, setEditRoutineId] = useState<number | null>(null)
    const afterConfigRef = useRef<null | ((data: any) => void)>(null)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [showErrorToast, setShowErrorToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [routineToDelete, setRoutineToDelete] = useState<RoutineData | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    // const [routineFormData, setRoutineFormData] = useState(null)
    const dispatch = useDispatch()
    const routinesFromStore: RutinaResponseDTO[] = useSelector((state: RootState) => state.routines?.routines ?? [])
    const savedRoutinesFromStore: RutinaResponseDTO[] = useSelector((state: RootState) => state.routines?.savedRoutines ?? [])
    const routinesLoading: boolean = useSelector((state: RootState) => state.routines?.loading ?? false)
    const categoriesFromStore: { id: number; name: string; active?: boolean }[] = useSelector((state: RootState) => state.categories?.categories ?? [])
    const agendaItems = useSelector((state: RootState) => state.agenda?.items ?? [])
    const navigate = useNavigate()
    const { getAccessTokenSilently } = useAuth0()
    const [initialLoading, setInitialLoading] = useState(true)

    useEffect(() => {
        const loadRoutines = async () => {
            // Siempre intentar cargar rutinas al montar el componente
            try {
                console.log('🔵 [MyRoutinesView] Cargando rutinas...')
                const startTime = Date.now()
                
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        scope: "openid profile email",
                    },
                });
                console.log('🔑 [MyRoutinesView] Token obtenido')
                await (dispatch as any)(fetchRoutines(token))
                console.log('✅ [MyRoutinesView] Rutinas cargadas desde el store')
                
                // Delay mínimo de 500ms para UX profesional
                const elapsed = Date.now() - startTime
                if (elapsed < 500) {
                    await new Promise(resolve => setTimeout(resolve, 500 - elapsed))
                }
            } catch (error) {
                console.error("❌ [MyRoutinesView] Error al obtener token:", error)
            } finally {
                setInitialLoading(false)
            }
        }
        loadRoutines()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    useEffect(() => {
        // Cargar rutinas guardadas del usuario
        const loadSavedRoutines = async () => {
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        scope: "openid profile email",
                    },
                })
                await (dispatch as any)(fetchSavedRoutines(token))
            } catch (error) {
                console.error("Error al cargar rutinas guardadas:", error)
            }
        }
        loadSavedRoutines()
    }, [dispatch, getAccessTokenSilently])

    useEffect(() => {
        // Cargar agenda del usuario
        const loadAgenda = async () => {
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        scope: "openid profile email",
                    },
                })
                await (dispatch as any)(fetchAgenda(token))
            } catch (error) {
                console.error("Error al cargar agenda:", error)
            }
        }
        loadAgenda()
    }, [dispatch, getAccessTokenSilently])

    useEffect(() => {
        // Fetch categories solo una vez al montar el componente
        const loadCategories = async () => {
            if (categoriesFromStore.length === 0) {
                try {
                    const token = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                            scope: "openid profile email",
                        },
                    });
                    dispatch(fetchCategories(token) as any)
                } catch (error) {
                    console.error("Error al obtener token para categorías:", error)
                }
            }
        }
        loadCategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    // Calcular estadísticas basadas en datos reales
    const stats = useMemo(() => {
        // Completadas este mes
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        
        const completedThisMonth = agendaItems.filter(item => {
            if (!item.completed || !item.completedAt) return false
            const completedDate = new Date(item.completedAt)
            return completedDate.getMonth() === currentMonth && 
                   completedDate.getFullYear() === currentYear
        }).length

        // Rutina favorita (la más frecuente en la agenda)
        const routineFrequency: Record<string, number> = {}
        agendaItems.forEach(item => {
            const routineName = item.routine?.name
            if (routineName) {
                routineFrequency[routineName] = (routineFrequency[routineName] || 0) + 1
            }
        })

        const favoriteRoutine = Object.entries(routineFrequency)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || "—"

        return {
            completedThisMonth,
            favoriteRoutine
        }
    }, [agendaItems])

    const handleOpenRoutineModal = (routine: RoutineData) => {
        setSelectedRoutine(routine)
        setIsRoutineModalOpen(true)
    }

    const handleCloseRoutineModal = () => {
        setIsRoutineModalOpen(false)
        setSelectedRoutine(null)
    }

    const handleStartRoutine = (routine: RoutineData) => {
        // Si es semanal, abrir el modal para elegir día antes de iniciar
        if (routine.isWeekly) {
            setSelectedRoutine(routine)
            setIsRoutineModalOpen(true)
            return
        }
        // Buscar el DTO según el tipo de rutina
        const dto = selectedType === "community"
            ? (savedRoutinesFromStore ?? []).find(r => String(r.id) === routine.id)
            : (routinesFromStore ?? []).find(r => String(r.id) === routine.id)
        if (!dto) return
        ;(dispatch as any)(startRoutineFromDto({ routine: dto }))
        navigate('/training')
    }

    const handleDeleteRoutine = async (routine: RoutineData) => {
        setRoutineToDelete(routine)
        setShowDeleteConfirm(true)
    }

    const performDeleteRoutine = async () => {
        if (!routineToDelete) return

        setIsDeleting(true)
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    scope: "openid profile email",
                },
            })

            const routineId = Number(routineToDelete.id)
            await (dispatch as any)(deleteRoutine({ token, id: routineId })).unwrap()
            
            setToastMessage('Rutina eliminada exitosamente')
            setShowSuccessToast(true)
            setShowDeleteConfirm(false)
            setRoutineToDelete(null)
            
            // Recargar rutinas
            await (dispatch as any)(fetchRoutines(token))
        } catch (error: any) {
            console.error('Error al eliminar rutina:', error)
            setToastMessage(error.message || 'Error al eliminar la rutina. Inténtalo de nuevo.')
            setShowErrorToast(true)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleSaveCommunityRoutine = async (routine: RoutineData) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    scope: "openid profile email",
                },
            })

            const routineId = Number(routine.id)
            
            // Verificar si la rutina ya está guardada
            const isSaved = savedRoutinesFromStore.some(r => r.id === routineId)
            
            console.log('🔵 Toggle save en rutina:', routineId, 'actualmente guardada:', isSaved)
            
            // El backend hace toggle automáticamente
            await (dispatch as any)(savePublicRoutine({ token, routineId })).unwrap()
            
            setToastMessage(isSaved ? 'Rutina quitada de guardadas' : 'Rutina guardada exitosamente')
            setShowSuccessToast(true)
            
            // Recargar rutinas guardadas
            await (dispatch as any)(fetchSavedRoutines(token))
        } catch (error: any) {
            console.error('Error al guardar/quitar rutina:', error)
            setToastMessage(error.message || 'Error al procesar la rutina. Inténtalo de nuevo.')
            setShowErrorToast(true)
        }
    }

    

    const categoriesFilterOptions = [
        { value: "", label: "Todas las categorías" },
        ...categoriesFromStore.filter((c: any) => c.active !== false).map((c: any) => ({ value: c.name, label: c.name }))
    ]

    const difficulties = [
        { value: "", label: "Todas las dificultades" },
        { value: "easy", label: "Principiante" },
        { value: "medium", label: "Intermedio" },
        { value: "hard", label: "Avanzado" },
    ];

    const typeOfRoutine = [
        { value: "simple", label: "Simple" },
        { value: "weekly", label: "Semanal" },
        { value: "community", label: "Comunidad" }
    ];

    // Helpers de mapeo desde RutinaResponseDTO
    const mapDifficultyToLevel = (difficulty: unknown): { label: string; color: 'green' | 'blue' | 'yellow' | 'red' | 'orange' } => {
        const diff = String(difficulty)
        switch (diff) {
            case 'PRINCIPIANTE':
                return { label: 'Principiante', color: 'green' }
            case 'INTERMEDIO':
                return { label: 'Intermedio', color: 'yellow' }
            case 'AVANZADO':
                return { label: 'Avanzado', color: 'red' }
            default:
                return { label: diff, color: 'blue' }
        }
    }

    const mapDayOfWeekToSpanish: Record<string, string> = {
        MONDAY: 'Lunes',
        TUESDAY: 'Martes',
        WEDNESDAY: 'Miércoles',
        THURSDAY: 'Jueves',
        FRIDAY: 'Viernes',
        SATURDAY: 'Sábado',
        SUNDAY: 'Domingo'
    }
    const dayEnumToIndex: Record<string, number> = {
        MONDAY: 0,
        TUESDAY: 1,
        WEDNESDAY: 2,
        THURSDAY: 3,
        FRIDAY: 4,
        SATURDAY: 5,
        SUNDAY: 6,
    }

    const mapDtoToRoutine = (dto: RutinaResponseDTO): RoutineData => {
        const sessions = dto.sessions ?? []
        const isWeekly = (sessions.length ?? 0) > 1
        const totalExercises = sessions.reduce((sum, s) => sum + (s.sessionExercises?.length ?? 0), 0)

        const activeDaysSet = new Set<string>()
        sessions.forEach(s => {
            const day = mapDayOfWeekToSpanish[String(s.dayOfWeek)]
            if (day) activeDaysSet.add(day)
        })
        const activeDays = Array.from(activeDaysSet)

        return {
            id: String(dto.id),
            title: dto.name,
            level: mapDifficultyToLevel(dto.difficulty),
            category: dto.category?.name ?? undefined,
            exerciseCount: totalExercises,
            isWeekly,
            weeklyData: isWeekly ? { duration: `${activeDays.length} días`, activeDays } : undefined,
            simpleData: !isWeekly ? { /* lastCompleted: no disponible en DTO */ } : undefined,
        }
    }

    // Datos de las rutinas mapeados desde el store
    const allRoutines: RoutineData[] = selectedType === "community" 
        ? (savedRoutinesFromStore ?? []).map(mapDtoToRoutine)
        : (routinesFromStore ?? []).map(mapDtoToRoutine)

    // Construir datos completos para el modal desde el DTO original
    const buildRoutineModalData = (routine: RoutineData) => {
        // Buscar el DTO en las rutinas del usuario o en las guardadas según el tipo seleccionado
        const dto = selectedType === "community"
            ? (savedRoutinesFromStore ?? []).find(r => String(r.id) === routine.id)
            : (routinesFromStore ?? []).find(r => String(r.id) === routine.id)
        // target muscles agregados de todas las sesiones
        const targetMusclesSet = new Set<string>()
        const exercises: { id: string; name: string; sets: number; reps: string; rest: string; equipment?: string }[] = []
        const exerciseDtos: any[] = []
        const exercisesByDayForModal: Record<string, typeof exercises> = {}

        if (dto) {
            for (const s of dto.sessions ?? []) {
                const dayName = mapDayOfWeekToSpanish[String(s.dayOfWeek)]
                if (dayName && !exercisesByDayForModal[dayName]) exercisesByDayForModal[dayName] = []
                for (const se of s.sessionExercises ?? []) {
                    // muscles
                    se.exercise?.targetMuscles?.forEach(m => targetMusclesSet.add(m.name))
                    // equipment
                    const equipmentNames = se.exercise?.equipment?.map(e => e.name).filter(Boolean) ?? []
                    const rest = typeof se.restBetweenSets === 'number' && !Number.isNaN(se.restBetweenSets)
                        ? `${se.restBetweenSets}s`
                        : '—'
                    const exItem = {
                        id: String(se.id),
                        name: se.exercise?.name ?? 'Ejercicio',
                        sets: se.sets,
                        reps: String(se.reps),
                        rest,
                        equipment: equipmentNames.length ? equipmentNames.join(', ') : undefined,
                    }
                    exercises.push(exItem)
                    if (dayName) {
                        exercisesByDayForModal[dayName]?.push(exItem)
                    }
                    if (se.exercise) {
                        exerciseDtos.push(se.exercise)
                    }
                }
            }
        }

        const routineData = {
            ...routine,
            description: dto?.description,
            estimatedTime: undefined,
            targetMuscles: Array.from(targetMusclesSet),
            exercises,
        }

        return { routineData, exerciseDtos, exercisesByDayForModal }
    }

    // Preparar datos para edición en el catálogo
    const prepareEditAndNavigate = (routine: RoutineData) => {
        const dto = (routinesFromStore ?? []).find(r => String(r.id) === routine.id)
        if (!dto) return
        const routineFormData = {
            name: dto.name,
            category: dto.category?.name ?? '',
            difficulty: mapDifficultyToLevel(dto.difficulty).label,
            description: dto.description || '',
            publishToCommunity: !!dto.isPublic,
        }
    // Open config modal first with prefill
        setEditPrefill(routineFormData)
    setEditRoutineId(dto.id)
        setIsConfigRoutineModalOpen(true)
        // Save the rest for after the modal confirmation
    const continueAfterConfig = (finalData: typeof routineFormData) => {
            const byDay: { [key: number]: any[] } = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
            for (const s of dto.sessions ?? []) {
                const idx = dayEnumToIndex[String(s.dayOfWeek)] ?? 0
                for (const se of s.sessionExercises ?? []) {
                    const tag = se.exercise?.equipment?.[0]?.name
                    byDay[idx].push({
                        id: se.exercise?.id,
                        title: se.exercise?.name,
                        tags: tag ? [{ label: tag, color: 'orange' as const }] : [],
                        config: {
                            series: se.sets,
                            reps: String(se.reps),
                            restTime: se.restBetweenSets != null ? String(se.restBetweenSets) : undefined,
                            notes: se.comment || '',
                        }
                    })
                }
            }
            // Persist and navigate to catalog selection mode
            localStorage.setItem('pendingRoutineData', JSON.stringify(finalData))
            localStorage.setItem('pendingExercisesByDay', JSON.stringify(byDay))
            localStorage.setItem('editingRoutineId', String(dto.id))
            const event = new CustomEvent('openCatalogSelectMode', { detail: finalData })
            window.dispatchEvent(event)
            navigate('/catalog')
        }
    // store continuation in ref to survive re-renders
    afterConfigRef.current = continueAfterConfig
        return
    }

    // Función para filtrar rutinas
    const getFilteredRoutines = () => {
        return allRoutines.filter(routine => {
            // Si es comunidad, NO filtrar por tipo (simple/semanal)
            if (selectedType !== "community") {
                // Filtro por tipo de rutina (solo para mis rutinas)
                if (selectedType === "simple" && routine.isWeekly) return false
                if (selectedType === "weekly" && !routine.isWeekly) return false
            }

            if (selectedCategory && routine.category !== selectedCategory) {
                return false
            }

            // Filtro por dificultad
            if (selectedDifficulty) {
                const difficultyMap: Record<string, string> = {
                    "easy": "Principiante",
                    "medium": "Intermedio",
                    "hard": "Avanzado"
                }
                if (routine.level.label !== difficultyMap[selectedDifficulty]) return false
            }

            // Filtro por búsqueda (título)
            if (searchTerm && !routine.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false
            }

            return true
        })
    }

    const filteredRoutines = getFilteredRoutines()

    const handleCreateRoutine = () => {
        setIsConfigRoutineModalOpen(true)
    }

    const handleContinueToSelection = (data: any) => {
        console.log("📝 Datos recibidos del modal:", data)
    // setRoutineFormData(data)
        setIsConfigRoutineModalOpen(false)

        // Guardar datos en localStorage para persistir durante la navegación
        localStorage.setItem('pendingRoutineData', JSON.stringify(data))

        // Disparar evento personalizado para abrir el catálogo en modo selección
        console.log("🔥 Disparando evento openCatalogSelectMode")
        const event = new CustomEvent('openCatalogSelectMode', {
            detail: data
        })
        window.dispatchEvent(event)
        console.log("✅ Evento disparado")

        console.log("Datos de rutina:", data)
        console.log("Continuando a selección de ejercicios...")

        console.log("🧭 Navegando a /catalog")
        navigate('/catalog')
    }

    // Agrupar rutinas en grupos de 3
    const groupedRoutines = []
    for (let i = 0; i < filteredRoutines.length; i += 3) {
        groupedRoutines.push(filteredRoutines.slice(i, i + 3))
    }

    return (
        <PrivateLayout>
            <SubHeader nameView="Mis rutinas" description="Gestiona y sigue tus rutinas de entrenamiento">
                <Button
                    iconPosition={false}
                    icon={<LuPlus />}
                    customWidthMobile="w-21"
                    lgPaddingLine="lg:px-4"
                    mdHeight=""
                    lgHeight=""
                    action={handleCreateRoutine}
                >
                    Crear rutina
                </Button>
            </SubHeader>

            <div className="flex flex-col mt-6 gap-6">
                <div className="flex flex-col lg:flex-row justify-between gap-5 lg:gap-20">
                    <FeatureCard
                        icon={<LuTarget size={20} className="text-[#89B4DB]" />}
                        title="Total rutinas"
                        value={allRoutines.length.toString()}
                    />
                    <FeatureCard
                        icon={<LuTrendingUp size={20} className="text-[#49D56E]" />}
                        title="Completadas este mes"
                        value={stats.completedThisMonth.toString()}
                    />
                </div>

                <div className="p-6 flex flex-col bg-tertiary rounded-lg gap-4 border border-white/20">
                    <SearchBar
                        placeholder="Buscar rutinas"
                        onSearch={setSearchTerm}
                    />
                    <div className="flex lg:flex-row flex-col w-full gap-4">
                        <CustomSelect
                            name="Todas las categorias"
                            options={categoriesFilterOptions}
                            defaultValue={selectedCategory}
                            onChange={setSelectedCategory}
                        />
                        <CustomSelect
                            name="Todas las dificultades"
                            options={difficulties}
                            defaultValue={selectedDifficulty}
                            onChange={setSelectedDifficulty}
                        />
                        <CustomSelect
                            name="Tipo de rutina"
                            options={typeOfRoutine}
                            defaultValue={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>
                </div>

                {/* Mostrar rutinas filtradas */}
                {(initialLoading || routinesLoading) ? (
                    <Spinner message="Cargando rutinas..." size="md" />
                ) : filteredRoutines.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-quaternary text-lg">
                            {allRoutines.length === 0 
                                ? (selectedType === "community" 
                                    ? 'No tienes rutinas guardadas. ¡Guarda rutinas desde la comunidad!' 
                                    : 'No tienes rutinas creadas. ¡Crea tu primera rutina!') 
                                : 'No se encontraron rutinas con los filtros seleccionados'}
                        </p>
                    </div>
                ) : (
                    groupedRoutines.map((group, groupIndex) => (
                        <div key={groupIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-[4em]">
                            {group.map((routine) => (
                                <RoutineCard
                                    key={routine.id}
                                    title={routine.title}
                                    level={routine.level}
                                    category={routine.category}
                                    exerciseCount={routine.exerciseCount}
                                    isWeekly={routine.isWeekly}
                                    weeklyData={routine.weeklyData}
                                    simpleData={routine.simpleData}
                                    isCommunityRoutine={selectedType === "community"}
                                    isSavedCommunityRoutine={selectedType === "community"}
                                    onStart={() => handleStartRoutine(routine)}
                                    onViewRoutine={() => handleOpenRoutineModal(routine)}
                                    onEdit={selectedType === "community" ? undefined : () => prepareEditAndNavigate(routine)}
                                    onDelete={selectedType === "community" ? undefined : () => handleDeleteRoutine(routine)}
                                    onSave={selectedType === "community" ? () => handleSaveCommunityRoutine(routine) : undefined}
                                />
                            ))}
                        </div>
                    ))
                )}
            </div>

            {selectedRoutine && (() => { const built = buildRoutineModalData(selectedRoutine); return (
                <RoutineModal
                    isOpen={isRoutineModalOpen}
                    onClose={handleCloseRoutineModal}
                    routine={built.routineData}
                    exercisesByDay={built.exercisesByDayForModal}
                    exerciseDtos={built.exerciseDtos}
                    onStart={(opts) => {
                        if (selectedRoutine) {
                            // Buscar el DTO según el tipo de rutina
                            const dto = selectedType === "community"
                                ? (savedRoutinesFromStore ?? []).find(r => String(r.id) === selectedRoutine.id)
                                : (routinesFromStore ?? []).find(r => String(r.id) === selectedRoutine.id)
                            if (dto) {
                                ;(dispatch as any)(startRoutineFromDto({ routine: dto, dayOfWeek: opts?.dayOfWeek }))
                                navigate('/training')
                            }
                        }
                        handleCloseRoutineModal()
                    }}
                    onEdit={() => {
                        handleCloseRoutineModal()
                        prepareEditAndNavigate(selectedRoutine)
                    }}
                />) })()}
            <ConfigRoutineModal
                isOpen={isConfigRoutineModalOpen}
                onClose={() => {
                    setIsConfigRoutineModalOpen(false)
                    setEditPrefill(null)
                    setEditRoutineId(null)
                }}
                initialFormData={editPrefill ?? undefined}
                showSaveChanges={!!editPrefill}
                categoriesOptions={categoriesFromStore.map(c => ({ value: c.name, label: c.name }))}
                difficultiesOptions={[
                    { value: 'Principiante', label: 'Principiante' },
                    { value: 'Intermedio', label: 'Intermedio' },
                    { value: 'Avanzado', label: 'Avanzado' },
                ]}
                onDelete={editRoutineId ? async () => {
                    // Cerrar el modal primero
                    setIsConfigRoutineModalOpen(false)
                    setEditPrefill(null)
                    
                    // Encontrar la rutina completa para pasar a handleDeleteRoutine
                    const routine = allRoutines.find(r => String(r.id) === String(editRoutineId))
                    if (routine) {
                        await handleDeleteRoutine(routine)
                    }
                    
                    setEditRoutineId(null)
                } : undefined}
                onSaveChanges={async (data) => {
                    // Update only routine metadata
                    if (!editRoutineId) return
                    const dto = (routinesFromStore ?? []).find(r => r.id === editRoutineId)
                    if (!dto) return
                    // build a minimal payload using existing sessions
                    // map difficulty label back to enum; resolve categoryId by label
                    const mapDiff = (label: string) => {
                        const l = (label || '').toLowerCase()
                        if (l === 'principiante') return 'PRINCIPIANTE'
                        if (l === 'intermedio') return 'INTERMEDIO'
                        if (l === 'avanzado') return 'AVANZADO'
                        return dto.difficulty
                    }
                    // Asegurar categorías cargadas antes de resolver categoryId
                    let categoriesList = categoriesFromStore
                    if (!categoriesList || categoriesList.length === 0) {
                        try {
                            const token = await getAccessTokenSilently({
                                authorizationParams: {
                                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                                    scope: "openid profile email",
                                },
                            });
                            const result: any = await (dispatch as any)(fetchCategories(token))
                            categoriesList = (result?.payload as any[]) ?? categoriesList
                        } catch {
                            // si falla, usamos las existentes
                        }
                    }
                    const resolvedCategoryId = (() => {
                        const name = (data.category || '').toLowerCase()
                        const found = (categoriesList || []).find((c: any) => (c.name || '').toLowerCase() === name)
                        return found?.id ?? dto.category.id
                    })()
                    const minimal = {
                        name: data.name,
                        description: data.description,
                        categoryId: resolvedCategoryId,
                        difficulty: mapDiff(data.difficulty),
                        isPublic: data.publishToCommunity ?? dto.isPublic,
                        userId: dto.user.id,
                        sessions: dto.sessions.map(s => ({
                            name: s.name,
                            description: s.description,
                            dayOfWeek: s.dayOfWeek,
                            // if category changed, propagate it; otherwise keep original session.category.id
                            categoryId: (typeof resolvedCategoryId === 'number' ? resolvedCategoryId : s.category.id),
                            sessionExercises: s.sessionExercises.map(se => ({
                                sets: se.sets,
                                reps: se.reps,
                                restBetweenSets: se.restBetweenSets,
                                comment: se.comment,
                                exerciseId: se.exercise.id,
                            }))
                        }))
                    }
                    try {
                        const token = await getAccessTokenSilently({
                            authorizationParams: {
                                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                                scope: "openid profile email",
                            },
                        });
                        await (dispatch as any)(updateRoutine({ token, id: dto.id, routineData: minimal }))
                        await (dispatch as any)(fetchRoutines(token))
                        setIsConfigRoutineModalOpen(false)
                        setEditPrefill(null)
                        setEditRoutineId(null)
                    } catch (e) {
                        console.error('Error al guardar cambios:', e)
                    }
                }}
                onContinueToSelection={(data) => {
                    setIsConfigRoutineModalOpen(false)
                    if (editPrefill) {
                        const fn = afterConfigRef.current
                        if (typeof fn === 'function') fn(data)
                        setEditPrefill(null)
                        setEditRoutineId(null)
                        afterConfigRef.current = null
                        return
                    }
                    handleContinueToSelection(data)
                }}
            />

            {/* Confirm Modal para eliminar rutina */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false)
                    setRoutineToDelete(null)
                }}
                onConfirm={performDeleteRoutine}
                title="Eliminar rutina"
                message={routineToDelete ? `¿Estás seguro de que deseas eliminar la rutina "${routineToDelete.title}"? Esta acción no se puede deshacer.` : ''}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={isDeleting}
            />

            {/* Toasts de éxito y error */}
            <Toast
                open={showSuccessToast}
                type="success"
                message={toastMessage}
                onClose={() => setShowSuccessToast(false)}
                durationMs={3000}
            />
            <Toast
                open={showErrorToast}
                type="error"
                message={toastMessage}
                onClose={() => setShowErrorToast(false)}
                durationMs={4000}
            />
        </PrivateLayout>
    )
}