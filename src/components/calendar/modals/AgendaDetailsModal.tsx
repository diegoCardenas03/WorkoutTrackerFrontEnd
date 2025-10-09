import { LuCalendar, LuClock, LuX } from "react-icons/lu"
import { Button } from "../../Button"
import type { AgendaResponseDTO } from "../../../types/agenda/AgendaResponseDTO"

interface AgendaDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  item?: AgendaResponseDTO | null
  onDelete?: (id: number) => void
  onMarkCompleted?: (id: number) => void
  onEdit?: (id: number) => void
  onStartTraining?: (agendaItem: AgendaResponseDTO) => void
}

export const AgendaDetailsModal = ({
  isOpen,
  onClose,
  item,
  onDelete,
  onMarkCompleted,
  onEdit,
  onStartTraining,
}: AgendaDetailsModalProps) => {
  if (!isOpen || !item) return null

  const start = new Date(item.startDate)
  const dateStr = start.toLocaleDateString()
  const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Verificar si la sesión es hoy o pasado (para permitir completar)
  const isDateTodayOrPast = () => {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const sessionDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    return sessionDate <= todayStart
  }

  const canMarkComplete = isDateTodayOrPast() && !item.completed
  const canEdit = !item.completed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-primary rounded-lg w-full max-w-md md:max-w-[650px] mx-auto shadow-2xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LuCalendar className="text-white" size={20} />
              <h2 className="text-white text-lg font-medium">Detalle de agenda</h2>
            </div>
            <button onClick={onClose} className="text-quaternary hover:text-white transition-colors cursor-pointer">
              <LuX className="md:text-[20px]" />
            </button>
          </div>
          <p className="text-quaternary text-sm mt-2">Revisa la información programada de tu entrenamiento</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-itemsCard rounded-lg p-4 border border-white/10">
            <p className="text-quaternary text-xs mb-1">Rutina</p>
            <p className="text-white text-sm md:text-base font-medium">{item.routine?.name ?? 'Rutina'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-itemsCard rounded-lg p-4 border border-white/10">
              <p className="text-quaternary text-xs mb-1">Fecha</p>
              <div className="flex items-center gap-2 text-white text-sm md:text-base">
                <LuCalendar size={16} /> {dateStr}
              </div>
            </div>
            <div className="bg-itemsCard rounded-lg p-4 border border-white/10">
              <p className="text-quaternary text-xs mb-1">Hora</p>
              <div className="flex items-center gap-2 text-white text-sm md:text-base">
                <LuClock size={16} /> {timeStr}
              </div>
            </div>
          </div>

          {typeof item.reminderMinutes === 'number' && item.reminderMinutes > 0 && (
            <div className="bg-itemsCard rounded-lg p-4 border border-white/10">
              <p className="text-quaternary text-xs mb-1">Recordatorio</p>
              <p className="text-white text-sm md:text-base">{item.reminderMinutes} minutos antes</p>
            </div>
          )}

          {item.comment && (
            <div className="bg-itemsCard rounded-lg p-4 border border-white/10">
              <p className="text-quaternary text-xs mb-1">Notas</p>
              <p className="text-white text-sm md:text-base whitespace-pre-wrap">{item.comment}</p>
            </div>
          )}

         
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/10">
          {item.completed ? (
            <div className="space-y-3">
              <div className="text-center text-green-400 text-sm bg-green-500/10 py-2 rounded-lg border border-green-500/20">
                ✓ Completada el {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : dateStr}
              </div>
              {onDelete && (
                <Button isWhite={false} isWidthFull={true} action={() => onDelete(item.id)}>Eliminar</Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Botón Comenzar entrenamiento - disponible solo si es hoy o pasado y no completada */}
              {canMarkComplete && onStartTraining && (
                <Button isWhite={true} isWidthFull={true} action={() => onStartTraining(item)}>
                  Comenzar entrenamiento
                </Button>
              )}
              
              <div className="flex flex-col md:flex-row gap-3">
                {canMarkComplete && onMarkCompleted && (
                  <Button isWhite={false} isWidthFull={true} action={() => onMarkCompleted(item.id)}>
                    Marcar completada
                  </Button>
                )}
                {canEdit && onEdit && (
                  <Button isWhite={false} isWidthFull={true} action={() => onEdit(item.id)}>Editar</Button>
                )}
              </div>
              {!canMarkComplete && (
                <div className="text-center text-quaternary text-xs bg-quaternary/5 py-2 rounded border border-quaternary/10">
                  ℹ️ Solo se puede comenzar el día de la sesión
                </div>
              )}
              {onDelete && (
                <Button isWhite={false} isWidthFull={true} action={() => onDelete(item.id)}>Eliminar</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
