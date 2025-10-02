import { useEffect, useState } from "react"
import { LuX, LuSave } from "react-icons/lu"
import { Button } from "../../Button"

interface MuscleZoneAdminModalProps {
  isOpen: boolean
  onClose: () => void
  muscleZone: { id: string; name: string; active: boolean } | null
  onSave: (data: { name: string; active: boolean }) => Promise<void>
}

export const MuscleZoneAdminModal = ({ isOpen, onClose, muscleZone, onSave }: MuscleZoneAdminModalProps) => {
  const [name, setName] = useState("")
  const [active, setActive] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<{ name?: string }>({})

  useEffect(() => {
    if (isOpen) {
      if (muscleZone) {
        setName(muscleZone.name)
        setActive(muscleZone.active)
      } else {
        setName("")
        setActive(true)
      }
      setErrors({})
    }
  }, [isOpen, muscleZone])

  const validate = () => {
    const newErrors: { name?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsSaving(true)
    try {
      await onSave({
        name: name.trim(),
        active,
      })
      onClose()
    } catch (error) {
      console.error('Error al guardar zona muscular:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-tertiary rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 bg-tertiary border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">
            {muscleZone ? 'Editar Zona Muscular' : 'Crear Zona Muscular'}
          </h2>
          <button
            onClick={onClose}
            className="text-quaternary hover:text-white transition-colors"
            disabled={isSaving}
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Nombre de la Zona Muscular <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Pecho, Espalda, Piernas..."
              disabled={isSaving}
              className={`w-full px-4 py-3 bg-primary border rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.name ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Estado
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={active}
                  onChange={() => setActive(true)}
                  disabled={isSaving}
                  className="w-4 h-4 text-quaternary cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-white text-sm">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!active}
                  onChange={() => setActive(false)}
                  disabled={isSaving}
                  className="w-4 h-4 text-quaternary cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-white text-sm">Inactivo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-tertiary border-t border-white/10 p-6 flex items-center justify-end gap-3">
          <Button
            isWhite={false}
            action={onClose}
            isBlocked={isSaving}
          >
            Cancelar
          </Button>
          <Button
            icon={<LuSave />}
            iconPosition={false}
            isWhite={true}
            action={handleSave}
            isBlocked={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
