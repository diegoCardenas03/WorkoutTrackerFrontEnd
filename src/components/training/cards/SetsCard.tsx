import { LuClock, LuPlay } from "react-icons/lu"
import { RestOverlay } from "./RestOverlay"

interface Set {
  id: number
  completed: boolean
  reps: number
}

interface SetsCardProps {
  sets: Set[]
  isResting: boolean
  restTimeRemaining: number
  onPauseRest?: () => void
  onResumeRest?: () => void
  onAddRest?: (seconds: number) => void
  onEndRest?: () => void
}

export const SetsCard = ({
  sets,
  isResting,
  restTimeRemaining,
  onPauseRest,
  onResumeRest,
  onAddRest,
  onEndRest
}: SetsCardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentSet = sets.find(set => !set.completed)

  return (
    <div className="bg-tertiary rounded-lg border border-white/10 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-base sm:text-lg font-medium">Series</h3>
        
        {/* Rest Timer inline badge (optional) */}
  {restTimeRemaining > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-itemsCard px-3 py-1 rounded-lg">
            <LuClock className="text-white" size={16} />
            <span className="text-white font-medium">{formatTime(restTimeRemaining)}</span>
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
            {/* Set Info (non-interactive) */}
            <div className="flex items-center gap-3">
              <span className={`font-medium ${set.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                Serie {index + 1}
              </span>
            </div>

            {/* Reps */}
            <span className={`text-sm ${set.completed ? 'text-green-400 line-through' : 'text-quaternary'}`}>
              {set.reps} reps
            </span>
          </div>
        ))}
      </div>

  {/* Current Set Indicator: hidden during rest or pause */}
  {currentSet && restTimeRemaining <= 0 && (
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-quaternary text-sm">
            <LuPlay size={14} />
            <span>Serie actual: {sets.findIndex(s => s.id === currentSet.id) + 1}</span>
          </div>
        </div>
      )}

      {/* Rest Overlay */}
      <RestOverlay
        isResting={isResting}
        restTimeRemaining={restTimeRemaining}
        onPauseRest={onPauseRest}
        onResumeRest={onResumeRest}
        onAddRest={onAddRest}
        onEndRest={onEndRest}
      />
    </div>
  )
}