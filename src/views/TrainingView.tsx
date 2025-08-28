import { useEffect, useMemo } from "react"
import { LuArrowLeft, LuSkipForward, LuX } from "react-icons/lu"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { Button } from "../components/Button"
import { ExercisesProgressCard } from "../components/training/cards/ExercisesProgressCard"
import { CurrentExerciseCard } from "../components/training/cards/CurrentExerciseCard"
import { SetsCard } from "../components/training/cards/SetsCard"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store"
import { addRestSeconds, nextExercise, pauseRest, previousExercise, resumeRest, toggleSetCompleted, tickSecond, startRest, stopRest, resetTraining } from "../store/slices/trainingSlice"
import { Navigate, useNavigate } from "react-router-dom"

// using training slice state, no local Exercise type needed

export const TrainingView = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const training = useSelector((state: RootState) => state.training)

    // Guard render: if no active routine, redirect immediately (avoids visual flash)
    if (!training.activeRoutineId || training.exercises.length === 0) {
        return <Navigate to="/routines" replace />
    }

    // Tick every second for elapsed time and rest countdown
    useEffect(() => {
        const interval = setInterval(() => dispatch(tickSecond()), 1000)
        return () => clearInterval(interval)
    }, [dispatch])

    const elapsedTime = useMemo(() => {
        const total = training.elapsedSeconds
        const m = Math.floor(total / 60).toString()
        const s = (total % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }, [training.elapsedSeconds])

    const currentExercise = training.exercises[training.currentExerciseIndex]
    const totalExercises = training.exercises.length
    const completedExercises = training.exercises.filter(ex => ex.seriesData.every(s => s.completed)).length
    const completionPercentage = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0

    const handleSetComplete = (setId: number) => {
        dispatch(toggleSetCompleted({ setId }))
        // Start rest immediately after marking set as done
        dispatch(startRest())
    }
    // rest starts automatically when completing a set
    const handlePreviousExercise = () => dispatch(previousExercise())
    const handleNextExercise = () => dispatch(nextExercise())
    const handleFinishWorkout = () => {
        // limpiar estado y volver a Mis rutinas
        dispatch(resetTraining())
        navigate('/routines')
    }
    const isResting = training.isResting
    const restTimeRemaining = training.restTimeRemaining

    return (
        <PrivateLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-white text-xl sm:text-2xl font-semibold">
                    {training.routineName ?? 'Entrenamiento'}
                </h1>
                <button onClick={handleFinishWorkout}>
                    <LuX className="text-quaternary hover:text-white transition-colors cursor-pointer text-2xl" />
                </button>
            </div>

            {/* Progress Card */}
            <div className="mb-6">
                <ExercisesProgressCard
                    currentExercise={Math.min(training.currentExerciseIndex + 1, Math.max(1, totalExercises))}
                    totalExercises={totalExercises}
                    completionPercentage={completionPercentage}
                    totalTime={elapsedTime}
                    completedExercises={completedExercises}
                />
            </div>

            {/* Layout principal */}
            <div className="flex flex-col gap-6 mb-6">
                {/* Current Exercise Card */}
                {currentExercise && (
                    <CurrentExerciseCard
                        title={currentExercise.title}
                        category={currentExercise.category ?? ''}
                        tags={currentExercise.tags}
                        sets={currentExercise.sets}
                        reps={currentExercise.reps}
                        weight={currentExercise.weight ?? ''}
                        restTime={currentExercise.restTime}
                        notes={currentExercise.notes}
                    />
                )}

                {/* Sets Card */}
                {currentExercise && (
                    <SetsCard
                        sets={currentExercise.seriesData}
                        isResting={isResting}
                        restTimeRemaining={restTimeRemaining}
                        onPauseRest={() => dispatch(pauseRest())}
                        onResumeRest={() => dispatch(resumeRest())}
                        onAddRest={(sec) => dispatch(addRestSeconds({ seconds: sec }))}
                        onEndRest={() => {
                            // Stop rest and proceed to next series if available, otherwise next exercise or finish
                            dispatch(stopRest())
                            const hasRemainingSets = currentExercise?.seriesData?.some(s => !s.completed)
                            if (hasRemainingSets) {
                                // move to next set by marking it complete? No, already completed by the button action.
                                // Here we only end rest to allow the user to press "Terminar serie" again for next set.
                                return
                            }
                            // no sets left -> next exercise or finish
                            const isLastExercise = training.currentExerciseIndex >= totalExercises - 1
                            if (!isLastExercise) {
                                handleNextExercise()
                            } else {
                                handleFinishWorkout()
                            }
                        }}
                    />
                )}
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
                    isBlocked={training.currentExerciseIndex === 0}
                >
                    Anterior
                </Button>

                {/* Siguiente o Finalizar */}
                {(() => {
                    const hasRemainingSets = currentExercise?.seriesData?.some(s => !s.completed)
                    const isLastExercise = training.currentExerciseIndex >= totalExercises - 1
                    if (hasRemainingSets) {
                        return (
                            <Button
                                icon={<LuSkipForward size={16} />}
                                isWhite={true}
                                isWidthFull={true}
                                action={() => {
                                    const nextSet = currentExercise?.seriesData.find(s => !s.completed)
                                    if (nextSet) handleSetComplete(nextSet.id)
                                }}
                            >
                                Terminar serie
                            </Button>
                        )
                    }
                    if (!isLastExercise) {
                        return (
                            <Button
                                icon={<LuSkipForward size={16} />}
                                isWhite={true}
                                isWidthFull={true}
                                action={handleNextExercise}
                            >
                                Siguiente ejercicio
                            </Button>
                        )
                    }
                    return (
                        <Button
                            isWhite={true}
                            isWidthFull={true}
                            action={handleFinishWorkout}
                        >
                            Finalizar entrenamiento
                        </Button>
                    )
                })()}
            </div>
        </PrivateLayout>
    )
}