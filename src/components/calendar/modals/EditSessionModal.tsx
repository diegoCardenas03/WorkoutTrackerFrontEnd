import { useEffect, useState } from "react"

import { Button } from "../../Button"
import { LuCalendar, LuX } from "react-icons/lu"
import type { AgendaResponseDTO } from "../../../types/agenda/AgendaResponseDTO"
import type { AgendaRequestDTO } from "../../../types/agenda/AgendaRequestDTO"

interface EditSessionModalProps {
  isOpen: boolean
  onClose: () => void
  item: AgendaResponseDTO
  onSave?: (changes: Partial<AgendaRequestDTO>) => Promise<void>
  isLoading?: boolean
}

export const EditSessionModal = ({
  isOpen,
  onClose,
  item,
  onSave,
  isLoading = false,
}: EditSessionModalProps) => {
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (item) {
      setNotes(item.comment ?? "")
    }
  }, [item])

  const handleSave = async () => {
    const changes: Partial<AgendaRequestDTO> = {}
    changes.comment = notes || undefined
    
    if (onSave) {
      await onSave(changes)
      // El parent cierra el modal después de guardar exitosamente
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 bg-opacity-75" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-primary rounded-lg w-full max-w-md md:max-w-[650px] mx-auto shadow-2xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LuCalendar className="text-white" size={20} />
              <h2 className="text-white text-lg font-medium">Editar entrenamiento</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              <LuX className="md:text-[20px]" />
            </button>
          </div>
          <p className="text-quaternary text-sm mt-2">Actualiza la sesión programada</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rutina (Solo lectura) */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">Rutina</label>
            <div className="w-full h-12 px-4 bg-itemsCard/50 border border-white/5 rounded-lg text-quaternary flex items-center cursor-not-allowed">
              {item.routine?.name || 'Sin rutina'}
            </div>
          </div>



          {/* Notas (Editable) */}
          <div>
            <label className="text-quaternary text-sm block mb-2">Notas (opcional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Objetivos, recordatorios, variaciones..." rows={4} className="w-full p-4 bg-itemsCard border border-white/5 rounded-lg text-white placeholder-quaternary resize-none focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-sm" />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row gap-3">
            <Button 
              isWhite={true} 
              action={handleSave} 
              isWidthFull={true}
              isBlocked={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Button isWhite={false} action={onClose} isWidthFull={true}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
