import { useEffect, useState, useMemo } from "react"
import { ExerciseCard } from "../components/catalog/cards/ExerciseCard"
import { CustomSelect } from "../components/CustomSelect"
import { SearchBar } from "../components/SearchBar"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { ExerciseModal } from "../components/catalog/modals/ExerciseModal"
import { Button } from "../components/Button"
import { LuArrowLeft, LuCheck } from "react-icons/lu"
import { ConfigExerciseOnSelectMode } from "../components/catalog/modals/ConfigExerciseOnSelectMode"
import { Toast } from "../components/Toast"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchActiveExercises } from "../store/slices/exerciseSlice"
import { fetchCategories } from "../store/slices/categorySlice"
import { fetchActiveMuscleZones } from "../store/slices/muscleZoneSlice"
import { fetchActiveEquipments } from "../store/slices/equipmentSlice"
import { fetchActiveMuscles } from "../store/slices/muscleSlice"
import { useRoutineSelection } from "../hooks/useRoutineSelection"
import type { EjercicioResponseDTO } from "../types/ejercicio/EjercicioResponseDTO"

import { createRoutine, updateRoutine } from "../store/slices/routineSlice"
import type { RutinaRequestDTO } from "../types/rutina/RutinaRequestDTO"
import { buildRutinaRequest } from "../utils/buildRutinaRequest"
import { useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { useUser } from "../hooks/useUser"

export const CatalogView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState<EjercicioResponseDTO | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMuscle, setSelectedMuscle] = useState("")
    const [selectedMuscleZone, setSelectedMuscleZone] = useState("")
    const [selectedEquipment, setSelectedEquipment] = useState("")
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [showErrorToast, setShowErrorToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")


    const dispatch = useDispatch<AppDispatch>()
    const { exercises, error: exercisesError, loading: exercisesLoading } = useSelector((state: RootState) => state.exercises)
    const categoriesFromStore = useSelector((state: RootState) => state.categories?.categories ?? []) as { id: number; name: string }[]
    const muscleZonesFromStore = useSelector((state: RootState) => state.muscleZones?.muscleZones ?? [])
    const equipmentsFromStore = useSelector((state: RootState) => state.equipments?.equipments ?? [])
    const musclesFromStore = useSelector((state: RootState) => state.muscles?.muscles ?? [])
    const navigate = useNavigate()
    const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null)
    const { getAccessTokenSilently } = useAuth0()
    const { userData } = useUser()

    // Custom hook para modo selección de rutina
    const {
        isSelectMode,
        routineData,
    // selectedExercises,
        isConfigExerciseModalOpen,
        exerciseToConfig,
        currentDay,
        exercisesByDay,
        setCurrentDay,
        setExercisesByDay,
        setSelectedExercises,
        enterSelectMode,
        exitSelectMode,
    handleExerciseConfig,
        handleAddExerciseToRoutine,
        getCurrentDayExercises,
        getTotalExercises,
        getExerciseCountForDay,
    isExerciseSelected,
        setIsConfigExerciseModalOpen,
        setExerciseToConfig,
    } = useRoutineSelection()

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        scope: "openid profile email",
                    },
                });
                
                dispatch(fetchActiveExercises(token) as any)
                dispatch(fetchCategories(token) as any)
                dispatch(fetchActiveMuscleZones(token) as any)
                dispatch(fetchActiveEquipments(token) as any)
                dispatch(fetchActiveMuscles(token) as any)
            } catch (error) {
                console.error("Error al obtener token:", error)
            }
        }

        loadData()

        const pendingRoutineData = localStorage.getItem('pendingRoutineData')
        if (pendingRoutineData) {
            const data = JSON.parse(pendingRoutineData)
            enterSelectMode(data)
            // precargar ejercicios si existen (flujo de edición)
            const pendingExercises = localStorage.getItem('pendingExercisesByDay')
            if (pendingExercises) {
                const byDay = JSON.parse(pendingExercises)
                setExercisesByDay(byDay)
                // construir selectedExercises plano
                const entries = Object.entries(byDay as Record<string, any[]>)
                const flat = entries.flatMap(([dayIdx, arr]) =>
                    (arr ?? []).map((ex: any) => ({ ...ex, dayIndex: Number(dayIdx) }))
                )
                setSelectedExercises(flat)
            }
            const editingIdStr = localStorage.getItem('editingRoutineId')
            if (editingIdStr) {
                setEditingRoutineId(Number(editingIdStr))
            }
            localStorage.removeItem('pendingRoutineData')
            localStorage.removeItem('pendingExercisesByDay')
            localStorage.removeItem('editingRoutineId')
        }

        const handleOpenSelectMode = (event: CustomEvent) => {
            enterSelectMode(event.detail)
        }

        window.addEventListener('openCatalogSelectMode', handleOpenSelectMode as EventListener)
        return () => {
            window.removeEventListener('openCatalogSelectMode', handleOpenSelectMode as EventListener)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])


    const [currentPage, setCurrentPage] = useState(1)
    const exercisesPerPage = 9



    const handleSearch = (value: string) => setSearchTerm(value)
    const handleMuscleSelect = (value: string) => setSelectedMuscle(value)
    const handleEquipmentSelect = (value: string) => setSelectedEquipment(value)

    // Crear mapeo de nombre de músculo -> nombre de zona muscular
    const muscleToZoneMap = useMemo(() => {
        const map = new Map<string, string>()
        musclesFromStore.forEach(muscle => {
            if (muscle.muscleGroup?.name) {
                map.set(muscle.name, muscle.muscleGroup.name)
            }
        })
        return map
    }, [musclesFromStore])

    const getEquipmentTag = (equipment: { id: number; name: string }[] = []) => {
        if (!Array.isArray(equipment) || equipment.length === 0) return []
        return [{ name: equipment[0].name, color: "orange" as const }]
    }

    const handleExerciseClick = (exercise: any) => {
        setSelectedExercise(exercise)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedExercise(null)
    }

    const handleWatchVideo = () => {
        // Siempre usar el primer video disponible (índice 0)
        if (selectedExercise?.sampleVideos && selectedExercise.sampleVideos.length > 0) {
            window.open(selectedExercise.sampleVideos[0], "_blank")
        }
    }

    // Nota: la resolución de categoría se realiza en handleFinishRoutine con datos frescos

    const resolveUserId = (): number => {
        // Obtener el ID del usuario autenticado actual
        if (userData?.id) {
            return userData.id
        }
        console.warn('⚠️ [CatalogView] No se pudo obtener el ID del usuario, usando fallback 1')
        return 1 // Fallback solo si no hay userData
    }

    const handleFinishRoutine = async () => {
        if (!routineData) return

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    scope: "openid profile email",
                },
            });

            // Asegurar categorías cargadas antes de resolver categoryId para evitar caer en "General"
            let categoriesList = categoriesFromStore as { id: number; name: string; active?: boolean }[]
            if (!categoriesList || categoriesList.length === 0) {
                try {
                    const result: any = await (dispatch as any)(fetchCategories(token))
                    categoriesList = (result?.payload as any[]) ?? categoriesList
                } catch {
                    // si falla, mantenemos el fallback existente
                }
            }

            const resolveCategoryIdLocal = (label: string | undefined): number => {
                const name = (label || '').trim().toLowerCase()
                const found = (categoriesList || []).find(c => (c.name || '').toLowerCase() === name)
                return found?.id ?? ((categoriesList || []).find(c => (c as any).active !== false)?.id ?? 1)
            }

            const payload: RutinaRequestDTO = buildRutinaRequest(
                routineData,
                exercisesByDay,
                resolveCategoryIdLocal,
                resolveUserId
            )

            if (editingRoutineId) {
                await dispatch(updateRoutine({ token, id: editingRoutineId, routineData: payload })).unwrap()
                setToastMessage('Rutina actualizada exitosamente')
            } else {
                await dispatch(createRoutine({ token, routineData: payload })).unwrap()
                setToastMessage('Rutina creada exitosamente')
            }
            
            setShowSuccessToast(true)
            
            // limpiar estado de selección y storage
            exitSelectMode()
            localStorage.removeItem('pendingRoutineData')
            localStorage.removeItem('pendingExercisesByDay')
            setEditingRoutineId(null)
            
            // Navegar inmediatamente - las rutinas se cargarán en MyRoutinesView
            navigate('/routines', { replace: true })
        } catch (e) {
            console.error('Error creando/actualizando rutina:', e)
            setToastMessage(editingRoutineId 
                ? 'Error al actualizar la rutina. Inténtalo de nuevo.' 
                : 'Error al crear la rutina. Inténtalo de nuevo.')
            setShowErrorToast(true)
        }
    }

    const filteredExercises = exercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMuscle = selectedMuscle
            ? exercise.targetMuscles?.some(m => m.name === selectedMuscle)
            : true
        const matchesMuscleZone = selectedMuscleZone
            ? exercise.targetMuscles?.some(m => {
                // Usar el mapeo de músculo a zona muscular
                const zoneName = muscleToZoneMap.get(m.name)
                return zoneName === selectedMuscleZone
            })
            : true
        const matchesEquipment = selectedEquipment
            ? exercise.equipment.some(eq => eq.name === selectedEquipment)
            : true
        return matchesSearch && matchesMuscle && matchesMuscleZone && matchesEquipment
    })

    const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage)
    const paginatedExercises = filteredExercises.slice(
        (currentPage - 1) * exercisesPerPage,
        currentPage * exercisesPerPage
    )

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, selectedMuscle, selectedMuscleZone, selectedEquipment])

    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    // Obtener músculos únicos de los ejercicios
    const uniqueMuscles = Array.from(
        new Set(
            exercises.flatMap(ex => ex.targetMuscles?.map(m => m.name) ?? [])
        )
    ).sort()

    const muscleOptions = [
        { value: "", label: "Todos los músculos" },
        ...uniqueMuscles.map(muscle => ({ value: muscle, label: muscle }))
    ]

    // Opciones de zonas musculares desde el store
    const muscleZoneOptions = [
        { value: "", label: "Todas las zonas" },
        ...muscleZonesFromStore
            .filter((zone: any) => zone.active !== false)
            .map((zone: any) => ({ value: zone.name, label: zone.name }))
    ]

    // Opciones de equipamiento desde el store
    const equipmentOptions = [
        { value: "", label: "Todo el equipo" },
        ...equipmentsFromStore
            .filter((eq: any) => eq.active !== false)
            .map((eq: any) => ({ value: eq.name, label: eq.name }))
    ]

    if (isSelectMode) {
        return (
            <PrivateLayout>
                <div className="border-b border-white/10 pb-6">
                    {exercisesError && !exercisesLoading && exercises.length === 0 && (
                        <div style={{ color: "white", background: "red", padding: 8, borderRadius: 4, marginBottom: 16 }}>
                            {exercisesError}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    // salir de selección y volver a Mis rutinas
                                    exitSelectMode()
                                    setEditingRoutineId(null)
                                    navigate('/routines', { replace: true })
                                }}
                                className="text-quaternary hover:text-white transition-colors cursor-pointer"
                            >
                                <LuArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-white text-xl font-semibold">
                                    {editingRoutineId ? 'Editando' : 'Creando'}: {routineData?.name || 'Rutina Prueba'}
                                </h1>
                                <p className="text-quaternary text-sm">
                                    Selecciona ejercicios para tu rutina semanal ({getTotalExercises()} ejercicios agregados)
                                </p>
                            </div>
                        </div>
                        <Button
                            icon={<LuCheck size={16} />}
                            iconPosition={false}
                            action={handleFinishRoutine}
                            isBlocked={getTotalExercises() === 0}
                            mobileText="text-[12px]"
                        >
                            Finalizar rutina
                        </Button>
                    </div>
                    <div>
                        <p className="text-quaternary text-sm mb-2">
                            Día actual: <span className="text-white font-medium">{daysOfWeek[currentDay]}</span>
                            {getCurrentDayExercises().length > 0 && (
                                <span className="text-quaternary ml-2">
                                    ({getCurrentDayExercises().length} ejercicio{getCurrentDayExercises().length !== 1 ? 's' : ''})
                                </span>
                            )}
                        </p>
                        <div className="flex gap-5 flex-wrap">
                            {daysOfWeek.map((day, index) => {
                                const exerciseCount = getExerciseCountForDay(index)
                                const isActive = index === currentDay
                                return (
                                    <button
                                        key={day}
                                        onClick={() => setCurrentDay(index)}
                                        className={`relative px-3 py-2 rounded text-sm transition-colors ${isActive
                                            ? 'bg-white text-black'
                                            : 'bg-itemsCard text-quaternary hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {day}
                                        {exerciseCount > 0 && (
                                            <span
                                                className={`absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full text-xs flex items-center justify-center font-medium ${isActive
                                                    ? 'bg-linksNavbar text-white'
                                                    : 'bg-white text-black'
                                                    }`}
                                            >
                                                {exerciseCount}
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-6 gap-6">
                    {getCurrentDayExercises().length > 0 && (
                        <div className="bg-tertiary rounded-lg p-4 border border-white/20">
                            <h3 className="text-white font-medium mb-3">
                                Ejercicios programados para {daysOfWeek[currentDay]}:
                            </h3>
                            <div className="space-y-2">
                                {getCurrentDayExercises().map((exercise, index) => (
                                    <div
                                        key={`${exercise.id}-${index}`}
                                        className="flex items-center justify-between bg-itemsCard rounded p-3 text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-white font-medium">{exercise.title}</span>
                                            <span className="text-quaternary">
                                                {exercise.config?.series}x{exercise.config?.reps} reps
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setExercisesByDay(prev => ({
                                                    ...prev,
                                                    [currentDay]: prev[currentDay].filter((_, i) => i !== index)
                                                }))
                                                setSelectedExercises(prev =>
                                                    prev.filter(ex => !(ex.id === exercise.id && ex.dayIndex === currentDay))
                                                )
                                            }}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="p-6 flex flex-col bg-tertiary rounded-lg gap-4 border border-white/20">
                        <SearchBar
                            placeholder="Buscar ejercicios..."
                            onSearch={handleSearch}
                        />
                        <div className="flex lg:flex-row flex-col w-full gap-4">
                            <CustomSelect
                                name="Todos los músculos"
                                options={muscleOptions}
                                defaultValue=""
                                onChange={handleMuscleSelect}
                            />
                            <CustomSelect
                                name="Todas las zonas"
                                options={muscleZoneOptions}
                                defaultValue=""
                                onChange={setSelectedMuscleZone}
                            />
                            <CustomSelect
                                name="Todo el equipo"
                                options={equipmentOptions}
                                defaultValue=""
                                onChange={handleEquipmentSelect}
                            />
                        </div>
                    </div>
                    <p className="text-quaternary">{filteredExercises.length} ejercicios encontrados</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {
                            filteredExercises.map((exercise) => (
                                <ExerciseCard
                                    key={exercise.id}
                                    name={exercise.name}
                                    description={exercise.description}
                                    tags={getEquipmentTag(exercise.equipment)}
                                    targetMuscles={exercise.targetMuscles?.map(m => m.name) || []}
                                    onClick={() => handleExerciseClick(exercise)}
                                    isSelectMode={true}
                                    isSelected={isExerciseSelected(exercise.id)}
                                    onConfigureExercise={() => handleExerciseConfig({
                                        id: exercise.id,
                                        title: exercise.name,
                                        tags: Array.isArray(exercise.equipment) && exercise.equipment.length > 0
                                            ? [{ label: exercise.equipment[0].name, color: 'orange' as const }]
                                            : [],
                                        targetMuscles: exercise.targetMuscles?.map(m => m.name) || []
                                    })}
                                />
                            ))
                        }
                    </div>
                </div>
                {exerciseToConfig && (
                    <ConfigExerciseOnSelectMode
                        isOpen={isConfigExerciseModalOpen}
                        onClose={() => {
                            setIsConfigExerciseModalOpen(false)
                            setExerciseToConfig(null)
                        }}
                        exercise={exerciseToConfig}
                        onAddExercise={handleAddExerciseToRoutine}
                    />
                )}
            </PrivateLayout>
        )
    }

    return (
        <PrivateLayout>
            <SubHeader nameView="Catálogo de ejercicios" description="Explora todos los ejercicios disponibles" />
            <div className="flex flex-col gap-6">
                {exercisesError && !exercisesLoading && exercises.length === 0 && (
                    <div style={{ color: "white", background: "red", padding: 8, borderRadius: 4, marginBottom: 16 }}>
                        {exercisesError}
                    </div>
                )}
                <div className="mt-6 p-6 flex flex-col bg-tertiary rounded-lg gap-4 border border-white/20">
                    <SearchBar
                        placeholder="Buscar ejercicios..."
                        onSearch={handleSearch}
                    />
                    <div className="flex lg:flex-row flex-col w-full gap-4">
                        <CustomSelect
                            name="Todos los músculos"
                            options={muscleOptions}
                            defaultValue=""
                            onChange={handleMuscleSelect}
                        />
                        <CustomSelect
                            name="Todas las zonas"
                            options={muscleZoneOptions}
                            defaultValue=""
                            onChange={setSelectedMuscleZone}
                        />
                        <CustomSelect
                            name="Todo el equipo"
                            options={equipmentOptions}
                            defaultValue=""
                            onChange={handleEquipmentSelect}
                        />
                    </div>
                </div>
                <div className="text-quaternary">
                    {filteredExercises.length} ejercicios encontrados
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[2em]">
                    {paginatedExercises.map((exercise) => (
                        <ExerciseCard
                            key={exercise.id}
                            name={exercise.name}
                            description={exercise.description}
                            tags={getEquipmentTag(exercise.equipment)}
                            targetMuscles={exercise.targetMuscles?.map(m => m.name) || []}
                            onClick={() => handleExerciseClick(exercise)}
                        />
                    ))}
                </div>
                {/* Controles de paginación */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded bg-itemsCard text-white disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-white text-black' : 'bg-itemsCard text-white'}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded bg-itemsCard text-white disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
            {selectedExercise && (
                <ExerciseModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    exercise={selectedExercise}
                    onWatchVideo={handleWatchVideo}
                />
            )}

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