import { useState } from "react"
import { LuClock, LuPlay } from "react-icons/lu"
import { Button } from "../../Button"

interface Set {
  id: number
  completed: boolean
  reps: number
}

interface SetsCardProps {
  sets: Set[]
  onSetComplete: (setId: number) => void
  onStartRest: () => void
  isResting: boolean
  restTimeRemaining: number
}

export const SetsCard = ({
  sets,
  onSetComplete,
  onStartRest,
  isResting,
  restTimeRemaining
}: SetsCardProps) => {
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const completedSets = sets.filter(set => set.completed).length
  const currentSet = sets.find(set => !set.completed)

  return (
    <div className="bg-tertiary rounded-lg border border-white/10 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-base sm:text-lg font-medium">Series</h3>
        
        {/* Rest Timer */}
        {isResting && (
          <div className="flex items-center gap-2 bg-itemsCard px-3 py-1 rounded-lg">
            <LuClock className="text-white" size={16} />
            <span className="text-white font-medium">
              {formatTime(restTimeRemaining)}
            </span>
            <span className="text-quaternary text-sm">Descanso</span>
          </div>
        )}
      </div>

      {/* Sets List */}
      <div className="space-y-3 mb-6">
        {sets.map((set, index) => (
          <div 
            key={set.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              set.completed 
                ? 'bg-green-500/10 border-green-500/30' 
                : currentSet?.id === set.id
                  ? 'bg-white/5 border-white/20'
                  : 'bg-itemsCard border-white/10'
            }`}
          >
            {/* Checkbox and Set Info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={set.completed}
                  onChange={() => onSetComplete(set.id)}
                  className="w-5 h-5 bg-itemsCard border border-white/20 rounded focus:ring-white/30 focus:ring-2 checked:bg-green-500 checked:border-green-500"
                />
                {set.completed && (
                  <svg 
                    className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <span className={`font-medium ${
                set.completed ? 'text-green-400' : 'text-white'
              }`}>
                Serie {index + 1}
              </span>
            </div>

            {/* Reps */}
            <span className={`text-sm ${
              set.completed ? 'text-green-400' : 'text-quaternary'
            }`}>
              {set.reps} reps
            </span>
          </div>
        ))}
      </div>

      {/* Rest Button */}
      {completedSets > 0 && completedSets < sets.length && !isResting && (
        <div className="pt-4 border-t border-white/10">
          <Button
            icon={<LuClock size={16} />}
            iconPosition={false}
            isWhite={false}
            isWidthFull={true}
            action={onStartRest}
          >
            Iniciar descanso (90s)
          </Button>
        </div>
      )}

      {/* Current Set Indicator */}
      {currentSet && !isResting && (
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-quaternary text-sm">
            <LuPlay size={14} />
            <span>Serie actual: {sets.findIndex(s => s.id === currentSet.id) + 1}</span>
          </div>
        </div>
      )}
    </div>
  )
}