import { useEffect, useState } from "react"
import { ExerciseCard } from "../components/catalog/cards/ExerciseCard"
import { CustomSelect } from "../components/CustomSelect"
import { SearchBar } from "../components/SearchBar"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { ExerciseModal } from "../components/catalog/modals/ExerciseModal"
import { handleCategoryChange } from "../utils/handleCategoryChange"
import { Button } from "../components/Button"
import { LuArrowLeft, LuCheck } from "react-icons/lu"
import { ConfigExerciseOnSelectMode } from "../components/catalog/modals/ConfigExerciseOnSelectMode"


interface RoutineFormData {
    name: string
    category: string
    difficulty: string
    description: string
    publishToCommunity: boolean
}

export const CatalogView = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [isSelectMode, setIsSelectMode] = useState(false)
    const [routineData, setRoutineData] = useState<RoutineFormData | null>(null)
    const [selectedExercises, setSelectedExercises] = useState<any[]>([])
    const [isConfigExerciseModalOpen, setIsConfigExerciseModalOpen] = useState(false)
    const [exerciseToConfig, setExerciseToConfig] = useState(null)
    const [currentDay, setCurrentDay] = useState(0) // 0 = Lunes, 1 = Martes, etc.
    const [exercisesByDay, setExercisesByDay] = useState<{ [key: number]: any[] }>({
        0: [], // Lunes
        1: [], // Martes  
        2: [], // Miércoles
        3: [], // Jueves
        4: [], // Viernes
        5: [], // Sábado
        6: []  // Domingo
    })

    useEffect(() => {
        console.log("CatalogView montado, configurando listener")

        const pendingRoutineData = localStorage.getItem('pendingRoutineData')
        if (pendingRoutineData) {
            console.log("📦 Datos encontrados en localStorage:", pendingRoutineData)
            const data = JSON.parse(pendingRoutineData)
            enterSelectMode(data)
            localStorage.removeItem('pendingRoutineData') // Limpiar después de usar
        }

        const handleOpenSelectMode = (event: CustomEvent) => {
            console.log("✅ Evento recibido en CatalogView:", event.detail)
            enterSelectMode(event.detail)
        }

        window.addEventListener('openCatalogSelectMode', handleOpenSelectMode as EventListener)

        return () => {
            console.log("CatalogView desmontado, removiendo listener")
            window.removeEventListener('openCatalogSelectMode', handleOpenSelectMode as EventListener)
        }
    }, [])

    const handleExerciseClick = (exercise: any) => {
        setSelectedExercise(exercise)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedExercise(null)
    }

    const handleAddToRoutine = () => {
        console.log("Añadir a rutina:", selectedExercise);
        // Aquí puedes manejar la lógica para añadir a rutina
    }

    const handleWatchVideo = () => {
        console.log("Ver video de:", selectedExercise);
        // Aquí puedes manejar la lógica para ver video
    }

    const enterSelectMode = (routineFormData: RoutineFormData) => {
        console.log("🚀 Entrando en modo selección con datos:", routineFormData)
        setRoutineData(routineFormData)
        setIsSelectMode(true)
        setSelectedExercises([])
        console.log("Estado después de enterSelectMode - isSelectMode:", true)
    }

    // Agregar log al inicio del componente para verificar el estado:
    console.log("🔍 CatalogView render - isSelectMode:", isSelectMode, "routineData:", routineData)

    const exitSelectMode = () => {
        setIsSelectMode(false)
        setRoutineData(null)
        setSelectedExercises([])
    }

    const handleExerciseConfig = (exercise: any) => {
        setExerciseToConfig(exercise)
        setIsConfigExerciseModalOpen(true)
    }

    const handleAddExerciseToRoutine = (exerciseConfig: any) => {
        console.log("Agregando ejercicio al día:", currentDay, exerciseConfig)

        // Agregar ejercicio al día actual
        setExercisesByDay(prev => ({
            ...prev,
            [currentDay]: [...prev[currentDay], { ...exerciseConfig, dayIndex: currentDay }]
        }))

        // Agregar a la lista general (para mantener compatibilidad)
        setSelectedExercises(prev => [...prev, { ...exerciseConfig, dayIndex: currentDay }])

        setIsConfigExerciseModalOpen(false)
        setExerciseToConfig(null)
    }

    // Función para obtener ejercicios del día actual
    const getCurrentDayExercises = () => {
        return exercisesByDay[currentDay] || []
    }

    // Función para verificar si un ejercicio está seleccionado en el día actual
    const isExerciseSelected = (exerciseId: string) => {
        return getCurrentDayExercises().some(ex => ex.id === exerciseId)
    }

    // Función para obtener el total de ejercicios de todos los días
    const getTotalExercises = () => {
        return Object.values(exercisesByDay).flat().length
    }

    // Función para obtener ejercicios por día específico
    const getExerciseCountForDay = (dayIndex: number) => {
        return exercisesByDay[dayIndex]?.length || 0
    }

    // Actualizar handleFinishRoutine
    const handleFinishRoutine = () => {
        console.log("Rutina finalizada:", {
            routineData,
            exercisesByDay,
            totalExercises: getTotalExercises()
        })
        exitSelectMode()
    }

    // Días de la semana
    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']





    const categories = [
        { value: "weight", label: "Peso corporal" },
        { value: "Bar", label: "Barra" },
        { value: "legs", label: "Piernas" },
        { value: "back", label: "Espalda" },
    ];
    const difficulties = [
        { value: "easy", label: "Principiante" },
        { value: "medium", label: "Intermedio" },
        { value: "hard", label: "Avanzado" },

    ];
    const equipment = [
        { value: "", label: "Todo el equipo" },
        { value: "Barra", label: "Barra" },
        { value: "Mancuernas", label: "Mancuernas" },
        { value: "Peso corporal", label: "Peso corporal" }
    ]

    const exercisePressBanca = {
        title: "Press de banca",
        description: "Ejercicio fundamental para el desarrollo del pecho, deltoides anterior y tríceps.",
        difficulty: { label: "Intermedio", color: "yellow" as const },
        equipment: { label: "Barra", color: "orange" as const },
        targetMuscles: ["Pecho", "Deltoides anterior", "Tríceps"],
        instructions: [
            "Acuéstate en el banco con los pies apoyados en el suelo",
            "Agarra la barra con las manos separadas a la altura de los hombros",
            "Baja la barra hasta tocar el pecho",
            "Empuja la barra hacia arriba hasta extender completamente los brazos"
        ],
        tips: "Mantén la espalda apoyada en el banco y controla el movimiento en todo momento."
    }

    const exercises = [
        {
            id: "1",
            title: "Press de banca",
            description: "Ejercicio fundamental para el desarrollo del pecho, deltoides anterior y tríceps.",
            tags: [
                { label: "Intermedio", color: "yellow" as const },
                { label: "Barra", color: "orange" as const }
            ]
        },
        {
            id: "2",
            title: "Sentadillas",
            description: "Ejercicio básico para fortalecer piernas y glúteos.",
            tags: [
                { label: "Principiante", color: "green" as const },
                { label: "Peso corporal", color: "blue" as const }
            ]
        },
        {
            id: "3",
            title: "Dominadas",
            description: "Ejercicio de peso corporal para fortalecer la espalda y bíceps.",
            tags: [
                { label: "Avanzado", color: "red" as const },
                { label: "Barra", color: "orange" as const }
            ]
        }
    ]



    if (isSelectMode) {
        return (
            <PrivateLayout>
                {/* Header especial para modo selección */}
                <div className="border-b border-white/10 pb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={exitSelectMode}
                                className="text-quaternary hover:text-white transition-colors"
                            >
                                <LuArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-white text-xl font-semibold">
                                    Creando: {routineData?.name || 'Rutina Prueba'}
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

                    {/* Días de la semana con contador */}
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

                                        {/* Contador de ejercicios */}
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

                {/* Contenido en modo selección */}
                <div className="flex flex-col mt-6 gap-6">
                    {/* Mostrar ejercicios del día actual */}
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
                                                // Remover ejercicio del día actual
                                                setExercisesByDay(prev => ({
                                                    ...prev,
                                                    [currentDay]: prev[currentDay].filter((_, i) => i !== index)
                                                }))
                                                // Actualizar lista general
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

                    {/* Filtros */}
                    <div className="p-6 flex flex-col bg-tertiary rounded-lg gap-4 border border-white/20">
                        <SearchBar
                            placeholder="Buscar ejercicios..."
                            onSearch={(value) => console.log("Searching:", value)}
                        />
                        <div className="flex lg:flex-row flex-col w-full gap-4">
                            <CustomSelect
                                name="Todas las categorías"
                                options={categories}
                                defaultValue=""
                                onChange={(value) => console.log(value)}
                            />
                            <CustomSelect
                                name="Todas las dificultades"
                                options={difficulties}
                                defaultValue=""
                                onChange={(value) => console.log(value)}
                            />
                            <CustomSelect
                                name="Todo el equipo"
                                options={equipment}
                                defaultValue=""
                                onChange={(value) => console.log(value)}
                            />
                        </div>
                    </div>

                    <p className="text-quaternary">{exercises.length} ejercicios encontrados</p>

                    {/* Grid de ejercicios en modo selección */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {exercises.map((exercise) => (
                            <ExerciseCard
                                key={exercise.id}
                                title={exercise.title}
                                description={exercise.description}
                                tags={exercise.tags}
                                onClick={() => { }}
                                isSelectMode={true}
                                isSelected={isExerciseSelected(exercise.id)}
                                onConfigureExercise={() => handleExerciseConfig(exercise)}
                            />
                        ))}
                    </div>
                </div>

                {/* Modal de configuración de ejercicio */}
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
                <div className="mt-6 p-6 flex flex-col bg-tertiary rounded-lg gap-4 border border-white/20">
                    <SearchBar
                        placeholder="Buscar ejercicios..."
                        onSearch={(value) => console.log("Searching:", value)}
                    />
                    <div className="flex lg:flex-row flex-col w-full gap-4">
                        <CustomSelect
                            name="Todas las categorias"
                            options={categories}
                            defaultValue=""
                            onChange={handleCategoryChange}
                        />
                        <CustomSelect
                            name="Todas las dificultades"
                            options={difficulties}
                            defaultValue=""
                            onChange={handleCategoryChange}
                        />
                        <CustomSelect
                            name="Todo el equipo"
                            options={equipment}
                            defaultValue=""
                            onChange={handleCategoryChange}
                        />
                    </div>
                </div>
                <div className="text-quaternary">
                    6 ejercicios encontrados
                </div>
                <div className="flex flex-col xl:flex-row gap-6 w-full justify-between">
                    <ExerciseCard
                        title="Press de banca"
                        description="Ejercicio fundamental para el desarrollo del pecho, deltoides anterior y tríceps."
                        tags={[
                            { label: "Intermedio", color: "yellow" },
                            { label: "Barra", color: "orange" }
                        ]}
                        onClick={() => handleExerciseClick(exercisePressBanca)}
                    />
                    <ExerciseCard
                        title="Sentadillas"
                        description="Ejercicio básico para fortalecer piernas y glúteos."
                        tags={[
                            { label: "Principiante", color: "green" },
                            { label: "Peso corporal", color: "blue" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                    <ExerciseCard
                        title="Dominadas"
                        description="Ejercicio de peso corporal para fortalecer la espalda y bíceps."
                        tags={[
                            { label: "Avanzado", color: "red" },
                            { label: "Barra", color: "orange" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                </div>
                <div className="flex flex-col lg:flex-row gap-6 w-full justify-between mb-20">
                    <ExerciseCard
                        title="Press de banca"
                        description="Ejercicio fundamental para el desarrollo del pecho, deltoides anterior y tríceps."
                        tags={[
                            { label: "Intermedio", color: "yellow" },
                            { label: "Barra", color: "orange" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                    <ExerciseCard
                        title="Sentadillas"
                        description="Ejercicio básico para fortalecer piernas y glúteos."
                        tags={[
                            { label: "Principiante", color: "green" },
                            { label: "Peso corporal", color: "blue" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                    <ExerciseCard
                        title="Dominadas"
                        description="Ejercicio de peso corporal para fortalecer la espalda y bíceps."
                        tags={[
                            { label: "Avanzado", color: "red" },
                            { label: "Barra", color: "orange" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                </div>
            </div>
            {/* Modal */}
            {selectedExercise && (
                <ExerciseModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    exercise={selectedExercise}
                    onAddToRoutine={handleAddToRoutine}
                    onWatchVideo={handleWatchVideo}
                />
            )}

        </PrivateLayout>
    )
}
