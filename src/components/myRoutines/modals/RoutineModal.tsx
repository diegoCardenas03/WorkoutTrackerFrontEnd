import { IoClose } from "react-icons/io5"
import { LuDumbbell, LuPencil } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"
import { Button } from "../../Button"
import { useState } from "react"
import type { EjercicioResponseDTO } from "../../../types/ejercicio/EjercicioResponseDTO"
import { ExerciseModal } from "../../catalog/modals/ExerciseModal"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  equipment?: string
}

interface RoutineModalProps {
  isOpen: boolean
  onClose: () => void
  routine: {
    id: string
    title: string
    level: {
      label: string
      color: 'green' | 'blue' | 'yellow' | 'red' | 'orange'
    }
    category?: string
    description?: string
    exerciseCount: number
    estimatedTime?: string
    targetMuscles?: string[]
    exercises: Exercise[]
    isWeekly?: boolean
    weeklyData?: {
      duration: string
      activeDays: string[]
      lastCompleted?: string
    }
    simpleData?: {
      lastCompleted?: string
    }
  }
  onEdit?: () => void
  exerciseDtos?: EjercicioResponseDTO[]
  // opcional: ejercicios agrupados por día (para rutinas semanales)
  exercisesByDay?: Record<string, Exercise[]>
}

export const RoutineModal = ({
  isOpen,
  onClose,
  routine,
  onEdit,
  exerciseDtos,
  exercisesByDay
}: RoutineModalProps) => {
  
  if (!isOpen) return null

  const defaultExercises: Exercise[] = [
    { id: "1", name: "Press de banca", sets: 4, reps: "8-12", rest: "90s", equipment: "Barra" },
    { id: "2", name: "Remo con barra", sets: 4, reps: "8-10", rest: "90s", equipment: "Barra" },
    { id: "3", name: "Press militar", sets: 3, reps: "10-12", rest: "60s", equipment: "Barra" },
    { id: "4", name: "Dominadas", sets: 3, reps: "6-10", rest: "120s", equipment: "Barra de dominadas" },
    { id: "5", name: "Curl de bíceps", sets: 3, reps: "12-15", rest: "45s", equipment: "Mancuernas" },
    { id: "6", name: "Extensiones de tríceps", sets: 3, reps: "12-15", rest: "45s", equipment: "Mancuernas" },
    { id: "7", name: "Fondos en paralelas", sets: 3, reps: "8-12", rest: "60s", equipment: "Paralelas" },
    { id: "8", name: "Face pulls", sets: 3, reps: "15-20", rest: "45s", equipment: "Polea" }
  ]

  const exercisesToShow = routine.exercises.length > 0 ? routine.exercises : defaultExercises

  // selector de día para rutinas semanales
  const dayKeys = exercisesByDay ? Object.keys(exercisesByDay) : []
  const getSpanishTodayLabel = (): string => {
    const idx = new Date().getDay() // 0=Dom,1=Lun,...
    const labels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return labels[idx]!
  }
  const availableDayLabels: string[] = exercisesByDay
    ? dayKeys
    : (routine.weeklyData?.activeDays ?? [])
  // intentar recuperar el último día usado para esta rutina
  const storageKey = `lastRoutineDay:${routine.id}`
  const savedDayRaw = (typeof window !== 'undefined') ? window.localStorage.getItem(storageKey) : null
  const savedDay = savedDayRaw && availableDayLabels.find(d => d.toLowerCase() === savedDayRaw.toLowerCase())
  const todayLabel = getSpanishTodayLabel()
  const initialDay = savedDay
    ?? availableDayLabels.find(d => d.toLowerCase() === todayLabel.toLowerCase())
    ?? availableDayLabels[0]
    ?? null
  const [selectedDay, setSelectedDay] = useState<string | null>(initialDay)

  const visibleExercises = exercisesByDay && selectedDay && exercisesByDay[selectedDay]?.length
    ? exercisesByDay[selectedDay]!
    : exercisesToShow

  const [selectedExerciseIdx, setSelectedExerciseIdx] = useState<number | null>(null)
  const selectedExerciseDto: EjercicioResponseDTO | null =
    selectedExerciseIdx !== null && exerciseDtos && exerciseDtos[selectedExerciseIdx]
      ? exerciseDtos[selectedExerciseIdx]!
      : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-primary border border-white/20 rounded-lg w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Header */}
        <div className="sticky top-0 rounded-t-lg p-6 pb-4 border-b border-white/10 bg-primary">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <LuDumbbell className="text-white" size={24} />
              <div>
                <h2 className="text-white text-lg md:text-xl font-medium">{routine.title}</h2>
                {routine.description && (
                  <p className="text-quaternary text-sm mt-1">{routine.description}</p>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-quaternary hover:text-white transition-colors cursor-pointer"
            >
              <IoClose className="text-[18px] md:text-[24px]" />
            </button>
          </div>

          {/* Tags y estadísticas */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {routine.category && (
              <div>
                <span className="text-quaternary text-xs block mb-1">Categoría</span>
                <span className="px-3 py-1 bg-primary rounded-full text-xs font-medium border border-white/20 text-white">
                  {routine.category}
                </span>
              </div>
            )}
            <div>
              <span className="text-quaternary text-xs block mb-1">Dificultad</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTagStyles(routine.level.color)}`}>
                {routine.level.label}
              </span>
            </div>
          </div>

          {/* Estadísticas de la rutina */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* <div className="text-center">
              
              <p className="text-white text-sm font-medium">{routine.exerciseCount}</p>
              <p className="text-quaternary text-xs">Ejercicios</p>
            </div> */}
            
            {/* {routine.estimatedTime && (
              <div className="text-center">
                
                <p className="text-white text-sm font-medium">{routine.estimatedTime}</p>
                <p className="text-quaternary text-xs">Duración</p>
              </div>
            )}

            {routine.isWeekly && routine.weeklyData ? (
              <div className="text-center">
                
                <p className="text-white text-sm font-medium">{routine.weeklyData.duration}</p>
                <p className="text-quaternary text-xs">Por semana</p>
              </div>
            ) : (
              routine.simpleData?.lastCompleted && (
                <div className="text-center">
                 
                  <p className="text-white text-sm font-medium">{routine.simpleData.lastCompleted}</p>
                  <p className="text-quaternary text-xs">Última vez</p>
                </div>
              )
            )} */}

            {/* {routine.targetMuscles && routine.targetMuscles.length > 0 && (
              <div className="text-center">
            
                <p className="text-white text-sm font-medium">{routine.targetMuscles.length}</p>
                <p className="text-quaternary text-xs">Músculos</p>
              </div>
            )} */}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Días activos (solo para rutinas semanales) */}
          {routine.isWeekly && routine.weeklyData && (
            <div>
              <h3 className="text-white text-base font-medium mb-3">Días de entrenamiento</h3>
              <div className="flex flex-wrap gap-2">
                {(exercisesByDay ? Object.keys(exercisesByDay) : routine.weeklyData.activeDays).map((day) => {
                  const isActive = selectedDay === day
                  const isToday = day.toLowerCase() === todayLabel.toLowerCase()
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-[2px] rounded-lg text-[12px] xl:text-sm border transition-colors flex items-center gap-2 ${isActive ? 'bg-white text-black border-white' : 'bg-itemsCard text-white border-white/10 hover:border-white/30'}`}
                    >
                      <span>{day}</span>
                      {isToday && (
                        <span className={`px-2 py-[1px] rounded-full text-[10px] font-medium ${isActive ? 'bg-black text-white' : 'bg-white text-black'}`}>Hoy</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Músculos objetivo */}
          {routine.targetMuscles && routine.targetMuscles.length > 0 && (
            <div>
              <h3 className="text-white text-base font-medium mb-3">Músculos objetivo</h3>
              <div className="flex flex-wrap gap-2">
                {routine.targetMuscles.map((muscle, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-linksNavbar text-quaternary rounded-full text-xs"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Lista de ejercicios */}
          <div>
            <h3 className="text-white text-base font-medium mb-4">Ejercicios ({visibleExercises.length}){selectedDay ? ` · ${selectedDay}` : ''}</h3>
            <div className="space-y-3">
              {visibleExercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="bg-tertiary rounded-lg p-4 border border-white/10 cursor-pointer hover:border-white/40 transition-colors"
                  onClick={() => setSelectedExerciseIdx(index)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-quaternary font-medium text-sm min-w-[24px]">
                        {index + 1}.
                      </span>
                      <h4 className="text-white font-medium text-sm md:text-base">
                        {exercise.name}
                      </h4>
                    </div>
                    {exercise.equipment && (
                      <span className="px-2 py-1 bg-itemsCard text-quaternary rounded text-xs">
                        {exercise.equipment}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-quaternary ml-7">
                    <span><strong>Series:</strong> {exercise.sets}</span>
                    <span><strong>Reps:</strong> {exercise.reps}</span>
                    <span><strong>Descanso:</strong> {exercise.rest}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con botón de editar */}
        <div className="sticky bottom-0 rounded-b-lg p-6 pt-4 border-t border-white/10 bg-primary">
          <Button
            isWhite={false}
            icon={<LuPencil size={16} />}
            iconPosition={false}
            action={onEdit}
            isWidthFull={true}
          >
            Editar rutina
          </Button>
        </div>
      </div>

      {/* Exercise Modal overlayed from routine modal */}
      <ExerciseModal
        isOpen={selectedExerciseIdx !== null}
        onClose={() => setSelectedExerciseIdx(null)}
  exercise={selectedExerciseDto}
        showBackButton={true}
        onBack={() => setSelectedExerciseIdx(null)}
      />
    </div>
  )
}