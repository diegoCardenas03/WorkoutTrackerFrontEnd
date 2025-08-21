import { useEffect, useState } from "react"
import { LuPlus, LuTarget, LuTrendingUp } from "react-icons/lu"
import { Button } from "../components/Button"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { FeatureCard } from "../components/FeatureCard"
import { SearchBar } from "../components/SearchBar"
import { CustomSelect } from "../components/CustomSelect"
// import { handleCategoryChange } from "../utils/handleCategoryChange"
import { RoutineCard } from "../components/myRoutines/cards/RoutineCard"
import { RoutineModal } from "../components/myRoutines/modals/RoutineModal"
import { ConfigRoutineModal } from "../components/myRoutines/modals/ConfigRoutineModal"
import { useNavigate } from "react-router-dom"
import type { RutinaResponseDTO } from "../types/rutina/RutinaResponseDTO"
import { useDispatch, useSelector } from "react-redux"
import { fetchRoutines } from "../store/slices/routineSlice"

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
    const [selectedType, setSelectedType] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false)
    const [selectedRoutine, setSelectedRoutine] = useState<RoutineData | null>(null)
    const [isConfigRoutineModalOpen, setIsConfigRoutineModalOpen] = useState(false)
    // const [routineFormData, setRoutineFormData] = useState(null)
    const dispatch = useDispatch()
    const routinesFromStore: RutinaResponseDTO[] = useSelector((state: any) => state.routines?.routines ?? [])
    const routinesLoading: boolean = useSelector((state: any) => state.routines?.loading ?? false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!routinesLoading && routinesFromStore.length === 0) {
            dispatch(fetchRoutines() as any)
        }
    }, [dispatch, routinesFromStore.length, routinesLoading])

    const handleOpenRoutineModal = (routine: RoutineData) => {
        setSelectedRoutine(routine)
        setIsRoutineModalOpen(true)
    }

    const handleCloseRoutineModal = () => {
        setIsRoutineModalOpen(false)
        setSelectedRoutine(null)
    }

    

    const categories = [
        { value: "", label: "Todas las categorías" },
        { value: "Fuerza", label: "Fuerza" },
        { value: "Cardio", label: "Cardio" },
        { value: "Peso corporal", label: "Peso corporal" },
        { value: "Barra", label: "Barra" },
        { value: "Piernas", label: "Piernas" },
        { value: "Espalda", label: "Espalda" },
    ];

    const difficulties = [
        { value: "", label: "Todas las dificultades" },
        { value: "easy", label: "Principiante" },
        { value: "medium", label: "Intermedio" },
        { value: "hard", label: "Avanzado" },
    ];

    const typeOfRoutine = [
        { value: "", label: "Todos los tipos" },
        { value: "simple", label: "Simple" },
        { value: "weekly", label: "Semanal" }
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
    const allRoutines: RoutineData[] = (routinesFromStore ?? []).map(mapDtoToRoutine)

    // Construir datos completos para el modal desde el DTO original
    const buildRoutineModalData = (routine: RoutineData) => {
        const dto = (routinesFromStore ?? []).find(r => String(r.id) === routine.id)
        // target muscles agregados de todas las sesiones
        const targetMusclesSet = new Set<string>()
        const exercises: { id: string; name: string; sets: number; reps: string; rest: string; equipment?: string }[] = []
        const exerciseDtos: any[] = []

        if (dto) {
            for (const s of dto.sessions ?? []) {
                for (const se of s.sessionExercises ?? []) {
                    // muscles
                    se.exercise?.targetMuscles?.forEach(m => targetMusclesSet.add(m.name))
                    // equipment
                    const equipmentNames = se.exercise?.equipment?.map(e => e.name).filter(Boolean) ?? []
                    const rest = typeof se.restBetweenSets === 'number' && !Number.isNaN(se.restBetweenSets)
                        ? `${se.restBetweenSets}s`
                        : '—'
                    exercises.push({
                        id: String(se.id),
                        name: se.exercise?.name ?? 'Ejercicio',
                        sets: se.sets,
                        reps: String(se.reps),
                        rest,
                        equipment: equipmentNames.length ? equipmentNames.join(', ') : undefined,
                    })
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

        return { routineData, exerciseDtos }
    }

    // Función para filtrar rutinas
    const getFilteredRoutines = () => {
        return allRoutines.filter(routine => {
            // Filtro por tipo de rutina
            if (selectedType === "simple" && routine.isWeekly) return false
            if (selectedType === "weekly" && !routine.isWeekly) return false

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
                        value="28"
                    />
                    <FeatureCard
                        icon={<LuTarget size={20} className="text-[#D089DB]" />}
                        title="Rutina favorita"
                        value="Tren Superior"
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
                            options={categories}
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
                {filteredRoutines.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-quaternary text-lg">No se encontraron rutinas con los filtros seleccionados</p>
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
                                    onStart={() => console.log("Starting routine", routine.id)}
                                    onViewRoutine={() => handleOpenRoutineModal(routine)}
                                    onMenuClick={() => console.log("Menu clicked", routine.id)}
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
                    exerciseDtos={built.exerciseDtos}
                    onStart={() => {
                        console.log("Starting routine", selectedRoutine.id)
                        handleCloseRoutineModal()
                    }}
                    onEdit={() => {
                        console.log("Editing routine", selectedRoutine.id)
                        handleCloseRoutineModal()
                    }}
                />) })()}
            <ConfigRoutineModal
                isOpen={isConfigRoutineModalOpen}
                onClose={() => setIsConfigRoutineModalOpen(false)}
                onContinueToSelection={handleContinueToSelection}
            />
        </PrivateLayout>
    )
}