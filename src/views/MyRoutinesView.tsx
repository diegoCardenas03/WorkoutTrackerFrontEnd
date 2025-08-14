import { useState } from "react"
import { LuClock, LuPlus, LuTarget, LuTrendingUp } from "react-icons/lu"
import { Button } from "../components/Button"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { FeatureCard } from "../components/FeatureCard"
import { SearchBar } from "../components/SearchBar"
import { CustomSelect } from "../components/CustomSelect"
import { handleCategoryChange } from "../utils/handleCategoryChange"
import { RoutineCard } from "../components/myRoutines/cards/RoutineCard"
import { RoutineModal } from "../components/myRoutines/modals/RoutineModal"
import { ConfigRoutineModal } from "../components/myRoutines/modals/ConfigRoutineModal"
import { useNavigate } from "react-router-dom"

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
    const [routineFormData, setRoutineFormData] = useState(null)
    const navigate = useNavigate()

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

    // Datos de las rutinas
    const allRoutines: RoutineData[] = [
        {
            id: "1",
            title: "Tren Superior",
            level: { label: "Intermedio", color: "yellow" },
            category: "Fuerza",
            exerciseCount: 8,
            isWeekly: false,
            simpleData: { lastCompleted: "hace 5 días" }
        },
        {
            id: "2",
            title: "Tren Superior Pro",
            level: { label: "Intermedio", color: "yellow" },
            category: "Fuerza",
            exerciseCount: 8,
            isWeekly: false,
            simpleData: { lastCompleted: "hace 5 días" }
        },
        {
            id: "3",
            title: "Cardio Básico",
            level: { label: "Principiante", color: "green" },
            category: "Cardio",
            exerciseCount: 6,
            isWeekly: false,
            simpleData: { lastCompleted: "hace 3 días" }
        },
        {
            id: "4",
            title: "Plan Fuerza Completo",
            level: { label: "Avanzado", color: "red" },
            exerciseCount: 24,
            isWeekly: true,
            weeklyData: {
                duration: "3 días",
                activeDays: ["Lunes", "Miércoles", "Viernes"],
                lastCompleted: "hace 2 días"
            }
        },
        {
            id: "5",
            title: "Rutina Semanal Cardio",
            level: { label: "Intermedio", color: "blue" },
            exerciseCount: 20,
            isWeekly: true,
            weeklyData: {
                duration: "5 días",
                activeDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
                lastCompleted: "hace 1 día"
            }
        },
        {
            id: "6",
            title: "Plan Semanal Avanzado",
            level: { label: "Avanzado", color: "red" },
            exerciseCount: 30,
            isWeekly: true,
            weeklyData: {
                duration: "6 días",
                activeDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                lastCompleted: "hace 1 día"
            }
        }
    ]

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
        setRoutineFormData(data)
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
                        <div key={groupIndex} className="flex flex-col xl:flex-row justify-between gap-6">
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

            {selectedRoutine && (
                <RoutineModal
                    isOpen={isRoutineModalOpen}
                    onClose={handleCloseRoutineModal}
                    routine={{
                        ...selectedRoutine,
                        description: "Rutina completa para el desarrollo del tren superior",
                        estimatedTime: "45-60 min",
                        targetMuscles: ["Pecho", "Espalda", "Hombros", "Bíceps", "Tríceps"],
                        exercises: []
                    }}
                    onStart={() => {
                        console.log("Starting routine", selectedRoutine.id)
                        handleCloseRoutineModal()
                    }}
                    onEdit={() => {
                        console.log("Editing routine", selectedRoutine.id)
                        handleCloseRoutineModal()
                    }}
                />
            )}
            <ConfigRoutineModal
                isOpen={isConfigRoutineModalOpen}
                onClose={() => setIsConfigRoutineModalOpen(false)}
                onContinueToSelection={handleContinueToSelection}
            />
        </PrivateLayout>
    )
}