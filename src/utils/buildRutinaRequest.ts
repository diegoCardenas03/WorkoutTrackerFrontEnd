import type { RutinaRequestDTO } from "../types/rutina/RutinaRequestDTO"
import { Dificultad } from "../types/enums/Dificultad"
import { DayOfWeek } from "../types/enums/DayOfWeek"

type RoutineFormData = {
  name: string
  category: string
  difficulty: string
  description: string
  publishToCommunity: boolean
}

export type ExercisesByDay = { [key: number]: any[] }

const mapDifficultyLabelToEnum = (label: string): typeof Dificultad[keyof typeof Dificultad] => {
  switch (label?.toLowerCase()) {
    case "principiante": return Dificultad.PRINCIPIANTE
    case "intermedio": return Dificultad.INTERMEDIO
    case "avanzado": return Dificultad.AVANZADO
    default: return Dificultad.INTERMEDIO
  }
}

const dayIndexToEnum = (idx: number): typeof DayOfWeek[keyof typeof DayOfWeek] => {
  const map = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY]
  return map[idx] ?? DayOfWeek.MONDAY
}

export function buildRutinaRequest(
  routineData: RoutineFormData,
  exercisesByDay: ExercisesByDay,
  resolveCategoryId: (categoryLabel: string | undefined) => number,
  resolveUserId: () => number
): RutinaRequestDTO {
  const categoryId = resolveCategoryId(routineData.category)
  const difficultyEnum = mapDifficultyLabelToEnum(routineData.difficulty)
  const userId = resolveUserId()

  const sessions = Object.entries(exercisesByDay)
    .filter(([, list]) => (list as any[]).length > 0)
    .map(([dayIdx, list], i) => {
      const dayIndex = Number(dayIdx)
      return {
        name: `Sesión ${i + 1}`,
        description: `Sesión del día ${dayIndex + 1}`,
        dayOfWeek: dayIndexToEnum(dayIndex),
        categoryId,
        sessionExercises: (list as any[]).map((ex: any) => ({
          sets: Number(ex.sets ?? ex.config?.series) || 0,
          reps: Number(ex.reps ?? ex.config?.reps) || 0,
          restBetweenSets: typeof ex.restBetweenSets === 'number'
            ? ex.restBetweenSets
            : Number(ex.restBetweenSets ?? ex.config?.restTime) || undefined,
          comment: ex.comment || undefined,
          exerciseId: Number(ex.id),
        }))
      }
    })

  return {
    name: routineData.name,
    description: routineData.description || undefined,
    isPublic: !!routineData.publishToCommunity,
    difficulty: difficultyEnum,
    categoryId,
    sessions,
    userId,
  }
}
