import { useState, useCallback } from "react"

interface RoutineFormData {
    name: string
    category: string
    difficulty: string
    description: string
    publishToCommunity: boolean
}

export function useRoutineSelection() {
    const [isSelectMode, setIsSelectMode] = useState(false)
    const [routineData, setRoutineData] = useState<RoutineFormData | null>(null)
    const [selectedExercises, setSelectedExercises] = useState<any[]>([])
    const [isConfigExerciseModalOpen, setIsConfigExerciseModalOpen] = useState(false)
    const [exerciseToConfig, setExerciseToConfig] = useState<any>(null)
    const [currentDay, setCurrentDay] = useState(0)
    const [exercisesByDay, setExercisesByDay] = useState<{ [key: number]: any[] }>({
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    })

    // Memoriza las funciones que se usan en dependencias de useEffect
    const enterSelectMode = useCallback((routineFormData: RoutineFormData) => {
        setRoutineData(routineFormData)
        setIsSelectMode(true)
        setSelectedExercises([])
    }, [])

    const exitSelectMode = useCallback(() => {
        setIsSelectMode(false)
        setRoutineData(null)
        setSelectedExercises([])
    }, [])

    const handleExerciseConfig = useCallback((exercise: any) => {
        setExerciseToConfig(exercise)
        setIsConfigExerciseModalOpen(true)
    }, [])

    const handleAddExerciseToRoutine = useCallback((exerciseConfig: any) => {
        setExercisesByDay(prev => ({
            ...prev,
            [currentDay]: [...prev[currentDay], { ...exerciseConfig, dayIndex: currentDay }]
        }))
        setSelectedExercises(prev => [...prev, { ...exerciseConfig, dayIndex: currentDay }])
        setIsConfigExerciseModalOpen(false)
        setExerciseToConfig(null)
    }, [currentDay])

    const getCurrentDayExercises = useCallback(() => exercisesByDay[currentDay] || [], [exercisesByDay, currentDay])
    const isExerciseSelected = useCallback(
        (exerciseId: number) => getCurrentDayExercises().some(ex => ex.id === exerciseId),
        [getCurrentDayExercises]
    )
    const getTotalExercises = useCallback(() => Object.values(exercisesByDay).flat().length, [exercisesByDay])
    const getExerciseCountForDay = useCallback(
        (dayIndex: number) => exercisesByDay[dayIndex]?.length || 0,
        [exercisesByDay]
    )

    return {
        isSelectMode,
        routineData,
        selectedExercises,
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
        isExerciseSelected,
        getTotalExercises,
        getExerciseCountForDay,
        setIsConfigExerciseModalOpen,
        setExerciseToConfig,
    }
}