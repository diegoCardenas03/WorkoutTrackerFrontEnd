import { useEffect, useState, useMemo, useRef } from "react"
import { LuX, LuSave, LuImage } from "react-icons/lu"
import { Button } from "../../Button"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store"

interface MuscleAdminModalProps {
  isOpen: boolean
  onClose: () => void
  muscle: { id: string; name: string; muscleGroupId: number; active: boolean; imageUrl?: string } | null
  onSave: (data: { name: string; muscleGroupId: number; active: boolean }, image?: File) => Promise<void>
}

export const MuscleAdminModal = ({ isOpen, onClose, muscle, onSave }: MuscleAdminModalProps) => {
  const { muscleZones } = useSelector((s: RootState) => s.muscleZones)
  const [name, setName] = useState("")
  const [muscleGroupId, setMuscleGroupId] = useState<number | "">("")
  const [active, setActive] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; muscleGroupId?: string; image?: string }>({})
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Incluir zonas activas + la zona seleccionada (aunque esté inactiva)
  const availableMuscleZones = useMemo(() => {
    const activeZones = muscleZones.filter(z => z.active)
    // Si estamos editando y la zona seleccionada no está en activas, agregarla
    if (muscle && muscleGroupId) {
      const selectedZone = muscleZones.find(z => z.id === muscleGroupId)
      if (selectedZone && !selectedZone.active) {
        return [...activeZones, selectedZone]
      }
    }
    return activeZones
  }, [muscleZones, muscle, muscleGroupId])

  useEffect(() => {
    if (isOpen) {
      if (muscle) {
        setName(muscle.name)
        setMuscleGroupId(muscle.muscleGroupId)
        setActive(muscle.active)
        // Cargar imagen existente si hay
        if (muscle.imageUrl) {
          setImagePreview(muscle.imageUrl)
        } else {
          setImagePreview(null)
        }
      } else {
        setName("")
        setMuscleGroupId("")
        setActive(true)
        setImagePreview(null)
      }
      setErrors({})
      setImage(null)
    }
  }, [isOpen, muscle])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Por favor selecciona un archivo de imagen válido' })
        return
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'La imagen no puede superar los 5MB' })
        return
      }

      setImage(file)
      setErrors({ ...errors, image: undefined })

      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validate = () => {
    const newErrors: { name?: string; muscleGroupId?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = "El nombre es requerido"
    }
    
    if (!muscleGroupId) {
      newErrors.muscleGroupId = "Debes seleccionar una zona muscular"
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
        muscleGroupId: muscleGroupId as number,
        active,
      }, image || undefined)
      onClose()
    } catch (error) {
      console.error('Error al guardar músculo:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-tertiary rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 bg-tertiary border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">
            {muscle ? 'Editar Músculo' : 'Crear Músculo'}
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
          {/* Imagen */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Imagen del Músculo
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-primary border border-white/20">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg bg-primary border border-white/20 flex items-center justify-center">
                  <LuImage className="text-quaternary" size={32} />
                </div>
              )}
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {image ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-quaternary text-xs mt-2">
                  {image ? image.name : 'Formato: JPG, PNG (máx. 5MB)'}
                </p>
                {errors.image && (
                  <p className="text-red-400 text-xs mt-1">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Nombre del Músculo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Bíceps braquial"
              disabled={isSaving}
              className={`w-full px-4 py-3 bg-primary border rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.name ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Zona Muscular */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Zona Muscular <span className="text-red-400">*</span>
            </label>
            <select
              value={muscleGroupId}
              onChange={(e) => setMuscleGroupId(e.target.value ? Number(e.target.value) : "")}
              disabled={isSaving}
              className={`w-full px-4 py-3 bg-primary border rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.muscleGroupId ? 'border-red-500' : 'border-white/20'
              }`}
            >
              <option value="">Selecciona una zona muscular</option>
              {availableMuscleZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}{!zone.active ? ' (Inactivo)' : ''}
                </option>
              ))}
            </select>
            {errors.muscleGroupId && (
              <p className="text-red-400 text-sm mt-1">{errors.muscleGroupId}</p>
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
