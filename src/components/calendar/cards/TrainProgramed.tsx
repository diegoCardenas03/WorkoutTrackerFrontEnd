
import { IoCheckmarkCircle } from "react-icons/io5"
import { LuDumbbell } from "react-icons/lu"
import { Button } from "../../Button"

interface Workout {
  id: string
  name: string
  duration: number // en minutos
  exercises: number
  isCompleted?: boolean
  time?: string
}

interface TrainProgramedProps {
  selectedDate?: Date
  workouts?: Workout[]
  onSelect?: (id: string) => void
  onMarkComplete?: (id: string) => void
}

export const TrainProgramed = ({ selectedDate, workouts = [], onSelect, onMarkComplete }: TrainProgramedProps) => {
  
  const formatDate = (date: Date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    
    return `${dayName}, ${day} de ${month}`
  }

  const defaultDate = selectedDate || new Date()

  // Verificar si la fecha seleccionada es hoy o pasado (para permitir completar)
  const isDateTodayOrPast = () => {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const selectedStart = new Date(defaultDate.getFullYear(), defaultDate.getMonth(), defaultDate.getDate())
    return selectedStart <= todayStart
  }

  const canMarkComplete = isDateTodayOrPast()

  return (
    <div className="bg-tertiary rounded-lg border border-white/10 p-6 w-full ">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-1">
          {formatDate(defaultDate)}
        </h3>
      </div>

      {/* Content */}
      {workouts.length === 0 ? (
        // Estado vacío
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-quaternary">
            <LuDumbbell size={48} />
          </div>
          <p className="text-quaternary text-sm">
            No hay entrenamientos programados
          </p>
        </div>
      ) : (
        // Lista de entrenamientos
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className={`
                bg-itemsCard rounded-lg p-4 border border-white/5
                hover:border-white/10 transition-all duration-200 cursor-pointer
                ${workout.isCompleted ? 'opacity-75' : ''}
              `}
              onClick={() => onSelect && onSelect(workout.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`font-medium ${workout.isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                      {workout.name}
                    </h4>
                    {workout.isCompleted && (
                      <IoCheckmarkCircle className="text-green-400" size={16} />
                    )}
                  </div>
                 
                  {workout.time && !workout.isCompleted && (
                    <div className="mt-2">
                      <span className="text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded">
                        {workout.time}
                      </span>
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  {!workout.isCompleted ? (
                    canMarkComplete ? (
                      <Button
                        isWhite={true}
                        isWidthFull={false}
                        paddingLine="px-3"
                        mdPaddingLine="md:px-3"
                        lgPaddingLine="lg:px-3"
                        mobileText="text-[12px]"
                        mdHeight="h-9"
                        lgHeight="h-9"
                        action={(e?: any) => {
                          // Evitar abrir detalles cuando se marca completada
                          if (e && e.stopPropagation) e.stopPropagation()
                          onMarkComplete && onMarkComplete(workout.id)
                        }}
                      >
                        Marcar completada
                      </Button>
                    ) : (
                      <span className="text-quaternary text-xs bg-quaternary/10 px-3 py-1.5 rounded">
                        Programada
                      </span>
                    )
                  ) : (
                    <span className="text-green-400 text-xs">Completada</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}