import { LuCalendar, LuX, LuDumbbell } from "react-icons/lu"
import { Button } from "../../Button"
import type { AgendaResponseDTO } from "../../../types/agenda/AgendaResponseDTO"
import type { RutinaResponseDTO } from "../../../types/rutina/RutinaResponseDTO"

interface AgendaDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  item?: AgendaResponseDTO | null
  sessionId?: number | null
  fullRoutine?: RutinaResponseDTO | null
  onDelete?: (id: number) => void
  onEdit?: (id: number) => void
  onStartTraining?: (agendaItem: AgendaResponseDTO) => void
}

export const AgendaDetailsModal = ({
  isOpen,
  onClose,
  item,
  sessionId,
  fullRoutine,
  onDelete,
  onEdit,
  onStartTraining,
}: AgendaDetailsModalProps) => {
  if (!isOpen || !item) return null

  const start = new Date(item.startDate)
  const dateStr = start.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  // Usar fullRoutine si está disponible, si no usar la del item
  const routineToUse = fullRoutine || item.routine
  
  // Buscar la sesión específica si se proporcionó sessionId
  const currentSession = sessionId 
    ? routineToUse?.sessions?.find(s => s.id === sessionId)
    : null
  
  // Debug: ver qué datos tenemos
  // console.log('🔍 Debug AgendaDetailsModal:')
  // console.log('- sessionId:', sessionId)
  // console.log('- fullRoutine:', fullRoutine)
  // console.log('- routineToUse:', routineToUse)
  // console.log('- routineToUse.sessions:', routineToUse?.sessions)
  // console.log('- currentSession:', currentSession)
  // console.log('- currentSession?.sessionExercises:', currentSession?.sessionExercises)

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

          <div className="bg-itemsCard rounded-lg p-4 border border-white/10">
            <p className="text-quaternary text-xs mb-1">Fecha de creación</p>
            <div className="flex items-center gap-2 text-white text-sm md:text-base">
              <LuCalendar size={16} /> {dateStr}
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

          {/* Mostrar ejercicios de la sesión si existe */}
          {currentSession && currentSession.sessionExercises && currentSession.sessionExercises.length > 0 && (
            <div className="bg-itemsCard rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <LuDumbbell size={16} className="text-quaternary" />
                <p className="text-quaternary text-xs">Ejercicios de la sesión: {currentSession.name}</p>
              </div>
              <div className="space-y-3">
                {currentSession.sessionExercises.map((sessionExercise, idx) => (
                  <div 
                    key={sessionExercise.id} 
                    className="bg-primary/50 rounded-lg p-3 border border-white/5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium mb-2">
                          {idx + 1}. {sessionExercise.exercise.name}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-quaternary">Series:</span>
                            <span className="text-white font-medium">{sessionExercise.sets}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-quaternary">Reps:</span>
                            <span className="text-white font-medium">{sessionExercise.reps}</span>
                          </div>
                          {sessionExercise.restBetweenSets && (
                            <div className="flex items-center gap-1">
                              <span className="text-quaternary">Descanso:</span>
                              <span className="text-white font-medium">{sessionExercise.restBetweenSets} min</span>
                            </div>
                          )}
                        </div>
                        {sessionExercise.comment && (
                          <p className="text-quaternary text-xs mt-2 italic">
                            {sessionExercise.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

         
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/10">
          <div className="flex flex-col gap-3">
          
        
            <div className="flex flex-col md:flex-row gap-3">
              {onEdit && (
                <Button isWhite={false} isWidthFull={true} action={() => onEdit(item.id)}>
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button isWhite={false} isWidthFull={true} action={() => onDelete(item.id)}>
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
