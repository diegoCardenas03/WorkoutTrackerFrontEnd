import { LuDumbbell, LuCalendarDays, LuPlay, LuEllipsisVertical } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"
import { Button } from "../../Button"

interface RoutineCardProps {
  title: string
  level: {
    label: string
    color: 'green' | 'blue' | 'yellow' | 'red' | 'orange'
  }
  category?: string // Agregar categoría como "Fuerza"
  exerciseCount: number
  isWeekly?: boolean
  weeklyData?: {
    duration: string
    activeDays: string[]
    lastCompleted?: string
  }
  simpleData?: {
    lastCompleted?: string
  }
  onStart?: () => void
  onViewRoutine?: () => void
  onMenuClick?: () => void
  className?: string
}

export const RoutineCard = ({
  title,
  level,
  category,
  exerciseCount,
  isWeekly = false,
  weeklyData,
  simpleData,
  onStart,
  onViewRoutine,
  onMenuClick,
  className = ""
}: RoutineCardProps) => {
  const dayAbbreviations: Record<string, string> = {
    'Lunes': 'Lun',
    'Martes': 'Mar', 
    'Miércoles': 'Mié',
    'Jueves': 'Jue',
    'Viernes': 'Vie',
    'Sábado': 'Sáb',
    'Domingo': 'Dom'
  }

  return (
    <div className={`bg-tertiary rounded-lg border border-white/10 p-4 md:p-6 transition-all duration-200 w-full 2xl:w-[24em]  ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white text-lg md:text-xl font-semibold mb-2">
            {title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <span className="px-3 py-[2px] bg-primary rounded-full text-xs md:text-sm font-medium border border-white/20 text-white">
                {category}
              </span>
            )}
            <span className={`px-3 py-[2px] rounded-full text-xs md:text-sm font-medium ${getTagStyles(level.color)}`}>
              {level.label}
            </span>
          </div>
        </div>
        
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="text-white hover:text-white/80 transition-colors p-1 cursor-pointer"
        >
          <LuEllipsisVertical size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-6">
        {/* Exercise Count */}
        <div className="flex items-center gap-2">
          <LuDumbbell className="text-white" size={16} />
          <span className="text-white text-sm md:text-base">
            {exerciseCount} Ejercicios
          </span>
        </div>

        {isWeekly && weeklyData ? (
          // Weekly routine data
          <>
            {/* Duration */}
            <div className="flex items-center gap-2">
              <LuCalendarDays className="text-quaternary" size={16} />
              <span className="text-quaternary text-sm md:text-base">
                {weeklyData.duration}
              </span>
            </div>

            {/* Active Days */}
            <div>
              <p className="text-quaternary text-sm mb-2">Días activos:</p>
              <div className="flex gap-2 flex-wrap">
                {weeklyData.activeDays.map((day) => (
                  <span
                    key={day}
                    className="px-2 py-1 bg-itemsCard border border-white/10 rounded text-white text-xs font-medium"
                  >
                    {dayAbbreviations[day] || day}
                  </span>
                ))}
              </div>
            </div>

            {/* Last Completed */}
            {weeklyData.lastCompleted && (
              <p className="text-quaternary text-xs">
                Última vez: {weeklyData.lastCompleted}
              </p>
            )}
          </>
        ) : (
          // Simple routine data
          simpleData?.lastCompleted && (
            <p className="text-quaternary text-xs">
              Última vez: {simpleData.lastCompleted}
            </p>
          )
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          isWhite={true}
          isWidthFull={true}
          icon={<LuPlay size={16} />}
          iconPosition={false}
          action={onStart}
          mobileHeight="h-10"
          mdHeight="h-7"
          lgHeight="h-7"
        >
          Iniciar rutina
        </Button>
        
        <Button
          isWhite={false}
          isWidthFull={true}
          action={onViewRoutine}
          mobileHeight="h-10"
          mdHeight="h-7"
          lgHeight="h-7"
        >
          Ver rutina
        </Button>
      </div>
    </div>
  )
}