import { LuDumbbell, LuCalendarDays, LuEllipsisVertical, LuTrash2, LuPencil, LuBookmark } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"
import { Button } from "../../Button"
import { useState, useRef, useEffect } from "react"

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
  isCommunityRoutine?: boolean // Nueva prop para identificar rutinas de comunidad
  isSavedCommunityRoutine?: boolean // Nueva prop para saber si ya está guardada
  onViewRoutine?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onSave?: () => void // Nueva acción para guardar/quitar rutinas de comunidad
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
  isCommunityRoutine = false,
  isSavedCommunityRoutine = false,
  onViewRoutine,
  onEdit,
  onDelete,
  onSave,
  className = ""
}: RoutineCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleDeleteClick = () => {
    setIsMenuOpen(false)
    if (onDelete) {
      onDelete()
    }
  }

  const handleEditClick = () => {
    setIsMenuOpen(false)
    if (onEdit) {
      onEdit()
    }
  }

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
    <div className={`bg-tertiary rounded-lg border border-white/10 p-4 md:p-6 transition-all duration-200 w-full ${className}`}>
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
        
        {/* Menu Button with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-white/80 transition-colors p-1 cursor-pointer"
          >
            <LuEllipsisVertical size={20} />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-8 bg-tertiary border border-white/20 rounded-lg shadow-lg z-10 min-w-[160px]">
              {isCommunityRoutine ? (
                // Menú para rutinas de comunidad
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    if (onSave) onSave()
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-itemsCard transition-colors rounded-lg cursor-pointer ${
                    isSavedCommunityRoutine 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-green-400 hover:text-green-300'
                  }`}
                >
                  <LuBookmark size={16} />
                  <span className="text-sm font-medium">
                    {isSavedCommunityRoutine ? 'Quitar de Mis Rutinas' : 'Guardar en Mis Rutinas'}
                  </span>
                </button>
              ) : (
                // Menú para rutinas propias
                <>
                  <button
                    onClick={handleEditClick}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-itemsCard transition-colors border-b border-white/10 cursor-pointer text-blue-400 hover:text-blue-300"
                  >
                    <LuPencil size={16} />
                    <span className="text-sm font-medium">Editar rutina</span>
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-itemsCard transition-colors rounded-lg cursor-pointer text-red-400 hover:text-red-300"
                  >
                    <LuTrash2 size={16} />
                    <span className="text-sm font-medium">Eliminar rutina</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
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