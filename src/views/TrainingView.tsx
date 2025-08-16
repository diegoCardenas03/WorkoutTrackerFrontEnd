import { useState, useEffect } from "react"
import { LuArrowLeft, LuHouse, LuChevronLeft, LuChevronRight, LuSkipForward } from "react-icons/lu"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { Button } from "../components/Button"
import { ExercisesProgressCard } from "../components/training/cards/ExercisesProgressCard"
import { CurrentExerciseCard } from "../components/training/cards/CurrentExerciseCard"
import { SetsCard } from "../components/training/cards/SetsCard"

interface Set {
    id: number
    completed: boolean
    reps: number
}

interface Exercise {
    id: string
    title: string
    category: string
    tags: { label: string; color: 'green' | 'blue' | 'yellow' | 'red' | 'orange' }[]
    sets: string
    reps: string
    weight: string
    restTime: string
    notes?: string
    seriesData: Set[]
}

export const TrainingView = () => {
    // Estados principales
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [isResting, setIsResting] = useState(false)
    const [restTimeRemaining, setRestTimeRemaining] = useState(0)
    const [startTime] = useState(new Date())
    const [elapsedTime, setElapsedTime] = useState("1:25")

    // Datos de ejemplo
    const exercises: Exercise[] = [
        {
            id: "1",
            title: "Press de banca",
            category: "Pecho",
            tags: [
                { label: "Intermedio", color: "yellow" },
                { label: "Barra", color: "orange" }
            ],
            sets: "3",
            reps: "10",
            weight: "80",
            restTime: "90",
            notes: "Mantén la espalda pegada al banco",
            seriesData: [
                { id: 1, completed: false, reps: 10 },
                { id: 2, completed: false, reps: 10 },
                { id: 3, completed: false, reps: 10 }
            ]
        },
        {
            id: "2",
            title: "Sentadillas",
            category: "Piernas",
            tags: [
                { label: "Principiante", color: "green" },
                { label: "Peso corporal", color: "blue" }
            ],
            sets: "4",
            reps: "12",
            weight: "60",
            restTime: "60",
            seriesData: [
                { id: 4, completed: false, reps: 12 },
                { id: 5, completed: false, reps: 12 },
                { id: 6, completed: false, reps: 12 },
                { id: 7, completed: false, reps: 12 }
            ]
        }
    ]

    const [exerciseStates, setExerciseStates] = useState(exercises)

    // Ejercicio actual
    const currentExercise = exerciseStates[currentExerciseIndex]

    // Cálculos de progreso
    const totalExercises = exercises.length
    const completedExercises = exerciseStates.filter(ex =>
        ex.seriesData.every(set => set.completed)
    ).length
    const completionPercentage = Math.round(
        (completedExercises / totalExercises) * 100
    )

    // Timer de descanso
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>
        if (isResting && restTimeRemaining > 0) {
            interval = setInterval(() => {
                setRestTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsResting(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isResting, restTimeRemaining])

    // Handlers
    const handleSetComplete = (setId: number) => {
        setExerciseStates(prev => prev.map(exercise =>
            exercise.id === currentExercise.id
                ? {
                    ...exercise,
                    seriesData: exercise.seriesData.map(set =>
                        set.id === setId ? { ...set, completed: !set.completed } : set
                    )
                }
                : exercise
        ))
    }

    const handleStartRest = () => {
        setIsResting(true)
        setRestTimeRemaining(parseInt(currentExercise.restTime))
    }

    const handlePreviousExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1)
            setIsResting(false)
        }
    }

    const handleNextExercise = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1)
            setIsResting(false)
        }
    }

    const handleFinishWorkout = () => {
        console.log("Entrenamiento finalizado")
        // Aquí puedes agregar la lógica para finalizar el entrenamiento
    }

    const handleGoHome = () => {
        console.log("Ir al inicio")
        // Aquí puedes agregar navegación al home
    }

    return (
        <PrivateLayout>
            {/* Header personalizado */}
            <div className="flex items-center justify-center mb-6">
                <h1 className="text-white text-xl sm:text-2xl font-semibold">
                    Tren Superior
                </h1>
            </div>

            {/* Progress Card */}
            <div className="mb-6">
                <ExercisesProgressCard
                    currentExercise={currentExerciseIndex + 1}
                    totalExercises={totalExercises}
                    completionPercentage={completionPercentage}
                    totalTime={elapsedTime}
                    completedExercises={completedExercises}
                />
            </div>

            {/* Layout principal */}
            <div className="flex flex-col gap-6 mb-6">
                {/* Current Exercise Card */}
                <CurrentExerciseCard
                    title={currentExercise.title}
                    category={currentExercise.category}
                    tags={currentExercise.tags}
                    sets={currentExercise.sets}
                    reps={currentExercise.reps}
                    weight={currentExercise.weight}
                    restTime={currentExercise.restTime}
                    notes={currentExercise.notes}
                />

                {/* Sets Card */}
                <SetsCard
                    sets={currentExercise.seriesData}
                    onSetComplete={handleSetComplete}
                    onStartRest={handleStartRest}
                    isResting={isResting}
                    restTimeRemaining={restTimeRemaining}
                />
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Anterior */}
                <Button
                    icon={<LuArrowLeft size={16} />}
                    iconPosition={false}
                    isWhite={false}
                    isWidthFull={true}
                    action={handlePreviousExercise}
                    isBlocked={currentExerciseIndex === 0}
                >
                    Anterior
                </Button>

                {/* Siguiente o Finalizar */}
                {currentExerciseIndex < exercises.length - 1 ? (
                    <Button
                        icon={<LuSkipForward size={16} />}
                        isWhite={true}
                        isWidthFull={true}
                        action={handleNextExercise}
                    >
                        Siguiente
                    </Button>
                ) : (
                    <Button
                        isWhite={true}
                        isWidthFull={true}
                        action={handleFinishWorkout}
                    >
                        Finalizar entrenamiento
                    </Button>
                )}
            </div>
        </PrivateLayout>
    )
}