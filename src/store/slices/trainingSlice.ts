import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RutinaResponseDTO } from '../../types/rutina/RutinaResponseDTO'
import type { SesionEjercicioResponseDTO } from '../../types/sesionEjercicio/SesionEjercicioResponseDTO'
import type { DayOfWeek } from '../../types/enums/DayOfWeek'

type TagColor = 'green' | 'blue' | 'yellow' | 'red' | 'orange'

export interface TrainingSet {
  id: number
  completed: boolean
  reps: number
}

export interface TrainingExercise {
  id: string
  title: string
  category?: string
  tags: { label: string; color: TagColor }[]
  sets: string
  reps: string
  weight?: string
  restTime: string // seconds
  notes?: string
  seriesData: TrainingSet[]
  videoUrls?: string[] // Array de URLs de videos demostrativos
}

export interface TrainingState {
  activeRoutineId: number | null
  routineName?: string
  dayOfWeek?: DayOfWeek
  agendaId?: number  // ID de la sesión de agenda si viene de ahí
  exercises: TrainingExercise[]
  currentExerciseIndex: number
  isResting: boolean
  restTimeRemaining: number
  startedAt?: string
  elapsedSeconds: number
}

const initialState: TrainingState = {
  activeRoutineId: null,
  routineName: undefined,
  dayOfWeek: undefined,
  agendaId: undefined,
  exercises: [],
  currentExerciseIndex: 0,
  isResting: false,
  restTimeRemaining: 0,
  startedAt: undefined,
  elapsedSeconds: 0,
}

/**
 * Convierte URLs de YouTube a formato embed
 * - https://www.youtube.com/watch?v=VIDEO_ID → https://www.youtube.com/embed/VIDEO_ID
 * - https://youtu.be/VIDEO_ID → https://www.youtube.com/embed/VIDEO_ID
 */
const convertToEmbedUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined
  
  try {
    // Si ya es una URL embed, retornarla tal cual
    if (url.includes('/embed/')) return url
    
    // Convertir watch?v= a embed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    
    // Convertir youtu.be a embed
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    
    // Si no es YouTube, retornar tal cual (puede ser Vimeo u otro)
    return url
  } catch (e) {
    console.error('Error converting video URL:', e)
    return url
  }
}

const buildExercisesFromSessions = (sessions: RutinaResponseDTO['sessions'], filterDay?: DayOfWeek): TrainingExercise[] => {
  const selectedSessions = filterDay ? sessions.filter(s => s.dayOfWeek === filterDay) : sessions
  const result: TrainingExercise[] = []
  let setAutoId = 1
  
  // Ordenar sesiones por ID para mantener orden consistente
  const sortedSessions = [...selectedSessions].sort((a, b) => a.id - b.id)
  
  sortedSessions.forEach(session => {
    // Ordenar ejercicios por ID para orden consistente
    const sortedExercises = [...(session.sessionExercises ?? [])].sort((a, b) => a.id - b.id)
    
    sortedExercises.forEach((se: SesionEjercicioResponseDTO) => {
  const equipmentNames = se.exercise?.equipment?.map(e => e.name).filter(Boolean) ?? []
      const tags = equipmentNames.length ? equipmentNames.map(n => ({ label: n, color: 'orange' as const })) : []
      const setsCount = Math.max(0, Number(se.sets) || 0)
      const reps = Math.max(0, Number(se.reps) || 0)
      const seriesData: TrainingSet[] = Array.from({ length: setsCount }, () => ({ id: setAutoId++, completed: false, reps }))
      
      // Convertir todas las URLs de video a formato embed
      const videoUrls = (se.exercise?.sampleVideos ?? [])
        .map(url => convertToEmbedUrl(url))
        .filter((url): url is string => url !== undefined)
      
      result.push({
        id: String(se.id),
        title: se.exercise?.name ?? 'Ejercicio',
        category: session.category?.name,
        tags,
        sets: String(setsCount),
        reps: String(reps),
        weight: undefined,
  restTime: String(se.restBetweenSets ?? 90),
        notes: se.comment,
        seriesData,
        videoUrls: videoUrls.length > 0 ? videoUrls : undefined, // Array de URLs convertidas
      })
    })
  })
  return result
}

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    startRoutineFromDto: (state, action: PayloadAction<{ routine: RutinaResponseDTO; dayOfWeek?: DayOfWeek; agendaId?: number }>) => {
      const { routine, dayOfWeek, agendaId } = action.payload
      state.activeRoutineId = routine.id
      state.routineName = routine.name
      state.dayOfWeek = dayOfWeek
      state.agendaId = agendaId
      state.exercises = buildExercisesFromSessions(routine.sessions ?? [], dayOfWeek)
      state.currentExerciseIndex = 0
      state.isResting = false
      state.restTimeRemaining = 0
      state.startedAt = new Date().toISOString()
      state.elapsedSeconds = 0
    },
    resetTraining: () => initialState,
    toggleSetCompleted: (state, action: PayloadAction<{ setId: number }>) => {
      const ex = state.exercises[state.currentExerciseIndex]
      if (!ex) return
      ex.seriesData = ex.seriesData.map(s => (s.id === action.payload.setId ? { ...s, completed: !s.completed } : s))
    },
    startRest: (state) => {
      const ex = state.exercises[state.currentExerciseIndex]
      const rest = ex ? Number.parseInt(ex.restTime) || 60 : 60
      state.isResting = true
      state.restTimeRemaining = rest
    },
    stopRest: (state) => {
      state.isResting = false
      state.restTimeRemaining = 0
    },
    pauseRest: (state) => {
      // pause but keep remaining time
      state.isResting = false
    },
    resumeRest: (state) => {
      if (state.restTimeRemaining > 0) {
        state.isResting = true
      }
    },
    addRestSeconds: (state, action: PayloadAction<{ seconds: number }>) => {
      const inc = Number(action.payload.seconds) || 0
      if (inc <= 0) return
      if (state.restTimeRemaining <= 0) {
        // No rest running nor paused -> start a new rest with inc
        state.isResting = true
        state.restTimeRemaining = inc
      } else {
        // Rest running or paused -> just add time, don't change pause/run state
        state.restTimeRemaining += inc
      }
    },
    tickSecond: (state) => {
      // global elapsed time
      state.elapsedSeconds += 1
      // rest countdown
      if (state.isResting) {
        if (state.restTimeRemaining <= 1) {
          // End rest
          state.isResting = false
          state.restTimeRemaining = 0
          // If the current exercise has no remaining sets, advance automatically
          const ex = state.exercises[state.currentExerciseIndex]
          if (ex) {
            const hasRemainingSets = ex.seriesData.some(s => !s.completed)
            if (!hasRemainingSets) {
              if (state.currentExerciseIndex < state.exercises.length - 1) {
                state.currentExerciseIndex += 1
                state.isResting = false
                state.restTimeRemaining = 0
              } else {
                // last exercise completed: stay; UI can show finish button
              }
            }
          }
        } else {
          state.restTimeRemaining -= 1
        }
      }
    },
    nextExercise: (state) => {
      if (state.currentExerciseIndex < state.exercises.length - 1) {
        state.currentExerciseIndex += 1
        state.isResting = false
        state.restTimeRemaining = 0
      }
    },
    previousExercise: (state) => {
      if (state.currentExerciseIndex > 0) {
        state.currentExerciseIndex -= 1
        state.isResting = false
        state.restTimeRemaining = 0
      }
    },
  },
})

export const {
  startRoutineFromDto,
  resetTraining,
  toggleSetCompleted,
  startRest,
  stopRest,
  pauseRest,
  resumeRest,
  addRestSeconds,
  tickSecond,
  nextExercise,
  previousExercise,
} = trainingSlice.actions

export default trainingSlice.reducer
