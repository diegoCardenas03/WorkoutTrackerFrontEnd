import { useState, useEffect } from "react"
import { IoClose } from "react-icons/io5"
import { LuPlus, LuX } from "react-icons/lu"
import { Button } from "../../Button"

interface Exercise {
  id: string
  image: string
  name: string
  description: string
  targetZone: string
  status: 'active' | 'inactive'
}

interface ExerciseAdminModalProps {
  isOpen: boolean
  onClose: () => void
  exercise?: Exercise | null
  onSave: (exerciseData: any) => void
}

export const ExerciseAdminModal = ({
  isOpen,
  onClose,
  exercise,
  onSave
}: ExerciseAdminModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetZones: [] as string[],
    videoLinks: [] as string[]
  })

  const isEditing = !!exercise

  // Zonas predefinidas para el select
  const availableZones = [
    "Pecho", "Espalda", "Piernas", "Glúteos", "Bíceps", "Tríceps", 
    "Hombros", "Abdominales", "Cuádriceps", "Isquiotibiales", "Gemelos"
  ]

  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name,
        description: exercise.description,
        targetZones: exercise.targetZone.split(", "),
        videoLinks: ["video-deadlift-barra.mp4", "video-deadlift-mancuernas.mp4"] // Ejemplo
      })
    } else {
      setFormData({
        name: "",
        description: "",
        targetZones: [],
        videoLinks: []
      })
    }
  }, [exercise])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTargetZone = (zone: string) => {
    if (!formData.targetZones.includes(zone)) {
      setFormData(prev => ({
        ...prev,
        targetZones: [...prev.targetZones, zone]
      }))
    }
  }

  const handleRemoveTargetZone = (zone: string) => {
    setFormData(prev => ({
      ...prev,
      targetZones: prev.targetZones.filter(z => z !== zone)
    }))
  }

  const handleAddVideoLink = () => {
    setFormData(prev => ({
      ...prev,
      videoLinks: [...prev.videoLinks, ""]
    }))
  }

  const handleUpdateVideoLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      videoLinks: prev.videoLinks.map((link, i) => i === index ? value : link)
    }))
  }

  const handleRemoveVideoLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videoLinks: prev.videoLinks.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-primary border border-white/20 rounded-lg w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-primary">
          <h2 className="text-white text-lg font-semibold">
            {isEditing ? "Editar Ejercicio" : "Crear Ejercicio"}
          </h2>
          <button 
            onClick={onClose}
            className="text-quaternary hover:text-white transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ej: Vuelos laterales"
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
            />
          </div>

          {/* Zona/s a trabajar */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Zona/s a trabajar
            </label>
            <select
              onChange={(e) => handleAddTargetZone(e.target.value)}
              value=""
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 mb-3"
            >
              <option value="" disabled className="bg-tertiary">
                Selecciona una o más opciones
              </option>
              {availableZones.map((zone) => (
                <option key={zone} value={zone} className="bg-tertiary">
                  {zone}
                </option>
              ))}
            </select>

            {/* Selected Zones */}
            <div className="flex flex-wrap gap-2">
              {formData.targetZones.map((zone) => (
                <span
                  key={zone}
                  className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {zone}
                  <button
                    onClick={() => handleRemoveTargetZone(zone)}
                    className="hover:text-blue-300 transition-colors"
                  >
                    <LuX size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Ingresa una descripción"
              rows={4}
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 resize-none"
            />
          </div>

          {/* Videos demostrativos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-white text-sm font-medium">
                Videos demostrativos
              </label>
              <button
                onClick={handleAddVideoLink}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
              >
                <LuPlus size={14} />
                Agregar
              </button>
            </div>

            <div className="space-y-3">
              {formData.videoLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => handleUpdateVideoLink(index, e.target.value)}
                    placeholder="Ingresa el enlace del video"
                    className="flex-1 p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
                  />
                  <button
                    onClick={() => handleRemoveVideoLink(index)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                  >
                    <LuX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-white/10 sticky bottom-0 bg-primary">
          <Button
            isWhite={false}
            action={handleCancel}
            isWidthFull={true}
          >
            Cancelar
          </Button>
          <Button
            isWhite={true}
            action={handleSave}
            isWidthFull={true}
          >
            {isEditing ? "Editar Ejercicio" : "Crear Ejercicio"}
          </Button>
        </div>
      </div>
    </div>
  )
}