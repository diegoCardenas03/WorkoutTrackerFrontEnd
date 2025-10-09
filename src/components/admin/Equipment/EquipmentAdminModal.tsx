import { useEffect, useState, useRef } from "react"
import { LuX, LuImage } from "react-icons/lu"

interface Equipment {
  id: string
  name: string
  active: boolean
  imageUrl?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  equipment: Equipment | null
  onSave: (data: { name: string; active: boolean }, image?: File) => void
}

export const EquipmentAdminModal = ({ isOpen, onClose, equipment, onSave }: Props) => {
  const [name, setName] = useState("")
  const [active, setActive] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (equipment) {
      setName(equipment.name)
      setActive(equipment.active)
      // Cargar imagen existente si hay
      if (equipment.imageUrl) {
        setImagePreview(equipment.imageUrl)
      } else {
        setImagePreview(null)
      }
    } else {
      setName("")
      setActive(true)
      setImagePreview(null)
    }
    setImage(null)
    setErrors({})
  }, [equipment, isOpen])

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

  const handleSave = () => {
    if (!name.trim()) {
      setErrors({ ...errors, name: 'El nombre es requerido' })
      return
    }
    setErrors({})
    onSave({ name: name.trim(), active }, image || undefined)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-tertiary border border-white/20 rounded-lg w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-xl font-semibold">
            {equipment ? "Editar Equipamiento" : "Crear Equipamiento"}
          </h2>
          <button
            onClick={onClose}
            className="text-quaternary hover:text-white transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-quaternary mb-2">
              Imagen del Equipamiento
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
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
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
            <label htmlFor="equipment-name" className="block text-sm font-medium text-quaternary mb-2">
              Nombre del Equipamiento <span className="text-red-500">*</span>
            </label>
            <input
              id="equipment-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors({ ...errors, name: undefined })
              }}
              placeholder="Ej: Mancuernas, Barra, Máquina Smith..."
              className={`w-full px-4 py-3 bg-primary border rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 transition-colors ${
                errors.name ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-quaternary mb-3">Estado</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="active"
                  checked={active}
                  onChange={() => setActive(true)}
                  className="w-4 h-4 text-green-500 focus:ring-green-500 focus:ring-2"
                />
                <span className="text-white text-sm">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="active"
                  checked={!active}
                  onChange={() => setActive(false)}
                  className="w-4 h-4 text-red-500 focus:ring-red-500 focus:ring-2"
                />
                <span className="text-white text-sm">Inactivo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-transparent border border-white/20 text-quaternary rounded-lg hover:bg-white/5 hover:text-white transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-5 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {equipment ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  )
}
