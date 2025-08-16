import { LuClock } from "react-icons/lu"

interface ExercisesProgressCardProps {
  currentExercise: number
  totalExercises: number
  completionPercentage: number
  totalTime: string
  completedExercises: number
}

export const ExercisesProgressCard = ({
  currentExercise,
  totalExercises,
  completionPercentage,
  totalTime,
  completedExercises
}: ExercisesProgressCardProps) => {
  return (
    <div className="bg-tertiary rounded-lg border border-white/10 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-sm sm:text-base font-medium">
          Ejercicio {currentExercise} de {totalExercises}
        </h3>
        <span className="text-quaternary text-sm">
          {completionPercentage}% completado
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-itemsCard rounded-full h-2 mb-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <LuClock className="text-quaternary" size={16} />
          <span className="text-quaternary text-[12px] md:text-base">Tiempo total:</span>
          <span className="text-white font-medium text-[12px] md:text-base">{totalTime}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-quaternary text-[12px] md:text-base">Ejercicios completados:</span>
          <span className="text-white font-medium text-[12px] md:text-base">{completedExercises}/{totalExercises}</span>
        </div>
      </div>
    </div>
  )
}