
import { IoTimeOutline, IoCheckmarkCircle } from "react-icons/io5"
import { LuDumbbell } from "react-icons/lu"

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
}

export const TrainProgramed = ({ selectedDate, workouts = [] }: TrainProgramedProps) => {
  
  const formatDate = (date: Date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    
    return `${dayName}, ${day} de ${month}`
  }

  const defaultDate = selectedDate || new Date()

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
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`font-medium ${workout.isCompleted ? 'text-green-400' : 'text-white'}`}>
                      {workout.name}
                    </h4>
                    {workout.isCompleted && (
                      <IoCheckmarkCircle className="text-green-400" size={16} />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-quaternary text-sm">
                    <div className="flex items-center gap-1">
                      <IoTimeOutline size={14} />
                      <span>{workout.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <LuDumbbell size={14} />
                      <span>{workout.exercises} ejercicios</span>
                    </div>
                  </div>
                  
                  {workout.time && (
                    <div className="mt-2">
                      <span className="text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded">
                        {workout.time}
                      </span>
                    </div>
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