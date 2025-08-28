import { LuClock, LuPause, LuPlay, LuPlus, LuFlag } from "react-icons/lu"
import { Button } from "../../Button"

interface RestOverlayProps {
  isResting: boolean
  restTimeRemaining: number
  onPauseRest?: () => void
  onResumeRest?: () => void
  onAddRest?: (seconds: number) => void
  onEndRest?: () => void
}

export const RestOverlay = ({
  isResting,
  restTimeRemaining,
  onPauseRest,
  onResumeRest,
  onAddRest,
  onEndRest,
}: RestOverlayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (restTimeRemaining <= 0) return null

  return (
    <div className="mt-4 p-4 sm:p-6 rounded-lg border border-white/10 bg-itemsCard">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-orange-400">
          <LuClock size={18} />
          <span className="text-sm">Descanso</span>
        </div>
        <div className="text-2xl font-semibold text-white">{formatTime(restTimeRemaining)}</div>
        <div className="flex flex-wrap gap-2 w-full justify-center">
          {isResting ? (
            <Button isWhite={false} isWidthFull={false} icon={<LuPause size={16} />} action={onPauseRest}>
              Pausar
            </Button>
          ) : (
            <Button isWhite={false} isWidthFull={false} icon={<LuPlay size={16} />} action={onResumeRest}>
              Reanudar
            </Button>
          )}
          <Button isWhite={false} isWidthFull={false} icon={<LuPlus size={16} />} action={() => onAddRest?.(15)}>
            +15s
          </Button>
          <Button isWhite={true} isWidthFull={false} icon={<LuFlag size={16} />} action={onEndRest}>
            Terminar descanso
          </Button>
        </div>
      </div>
    </div>
  )
}
