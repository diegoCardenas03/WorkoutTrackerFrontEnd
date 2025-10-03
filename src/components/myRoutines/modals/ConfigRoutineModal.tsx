import { useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"
import { LuDumbbell, LuTrash2 } from "react-icons/lu"
import { Button } from "../../Button"
import { CustomSelect } from "../../CustomSelect"

interface ConfigRoutineModalProps {
  isOpen: boolean
  onClose: () => void
  onContinueToSelection: (routineData: RoutineFormData) => void
  initialFormData?: Partial<RoutineFormData>
  showSaveChanges?: boolean
  onSaveChanges?: (routineData: RoutineFormData) => void
  onDelete?: () => void
  categoriesOptions?: { value: string; label: string }[]
  difficultiesOptions?: { value: string; label: string }[]
}

interface RoutineFormData {
  name: string
  category: string
  difficulty: string
  description: string
  publishToCommunity: boolean
}

export const ConfigRoutineModal = ({
  isOpen,
  onClose,
  onContinueToSelection,
  initialFormData,
  showSaveChanges,
  onSaveChanges,
  onDelete,
  categoriesOptions,
  difficultiesOptions,
}: ConfigRoutineModalProps) => {
  const [formData, setFormData] = useState<RoutineFormData>({
    name: "",
    category: "",
    difficulty: "",
    description: "",
    publishToCommunity: false
  })
  const [initialSnapshot, setInitialSnapshot] = useState<RoutineFormData | null>(null)

  // Prefill data when editing
  useEffect(() => {
    if (isOpen && initialFormData) {
      setFormData(prev => ({
        ...prev,
        ...initialFormData,
        name: initialFormData.name ?? prev.name,
        category: initialFormData.category ?? prev.category,
        difficulty: initialFormData.difficulty ?? prev.difficulty,
        description: initialFormData.description ?? prev.description,
        publishToCommunity: initialFormData.publishToCommunity ?? prev.publishToCommunity,
      }))
      // take a snapshot to compare for enabling save
      const snap: RoutineFormData = {
        name: initialFormData.name ?? "",
        category: initialFormData.category ?? "",
        difficulty: initialFormData.difficulty ?? "",
        description: initialFormData.description ?? "",
        publishToCommunity: initialFormData.publishToCommunity ?? false,
      }
      setInitialSnapshot(snap)
    }
  }, [isOpen, initialFormData])

  const categories = categoriesOptions ?? [
    { value: "Fuerza", label: "Fuerza" },
    { value: "Cardio", label: "Cardio" },
    { value: "Peso corporal", label: "Peso corporal" },
    { value: "Flexibilidad", label: "Flexibilidad" }
  ]

  const difficulties = difficultiesOptions ?? [
    { value: "Principiante", label: "Principiante" },
    { value: "Intermedio", label: "Intermedio" },
    { value: "Avanzado", label: "Avanzado" }
  ]

  const handleSubmit = () => {
    if (formData.name && formData.category && formData.difficulty) {
      onContinueToSelection(formData)
    }
  }

  if (!isOpen) return null

  const isDirty = initialSnapshot
    ? (
        formData.name !== initialSnapshot.name ||
        formData.category !== initialSnapshot.category ||
        formData.difficulty !== initialSnapshot.difficulty ||
        formData.description !== initialSnapshot.description ||
        formData.publishToCommunity !== initialSnapshot.publishToCommunity
      )
    : (formData.name !== "" || formData.category !== "" || formData.difficulty !== "" || formData.description !== "" || formData.publishToCommunity)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-primary border border-white/20 rounded-lg w-full max-w-md mx-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LuDumbbell className="text-white" size={20} />
              <h2 className="text-white text-lg font-medium">Información básica de la rutina</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-quaternary hover:text-white transition-colors cursor-pointer"
            >
              <IoClose size={20} />
            </button>
          </div>
          <p className="text-quaternary text-sm mt-2">
            Completa la información básica y luego selecciona los ejercicios desde el catálogo
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Nombre de la rutina */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Nombre de la rutina
            </label>
            <input
              type="text"
              placeholder="Ej: Tren Superior Avanzado"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-itemsCard border border-white/10 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Categoría y Dificultad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Categoría
              </label>
              <CustomSelect
                name="Selecciona una categoría"
                options={categories}
                defaultValue={formData.category}
                onChange={(value) => setFormData({...formData, category: value})}
                ignoreWidth
              />
            </div>
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Dificultad
              </label>
              <CustomSelect
                name="Selecciona la dificultad"
                options={difficulties}
                defaultValue={formData.difficulty}
                onChange={(value) => setFormData({...formData, difficulty: value})}
                ignoreWidth
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Descripción
            </label>
            <textarea
              placeholder="Describe el objetivo y características de esta rutina..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full p-3 bg-itemsCard border border-white/10 rounded-lg text-white placeholder-quaternary resize-none focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="publishToCommunity"
              checked={formData.publishToCommunity}
              onChange={(e) => setFormData({...formData, publishToCommunity: e.target.checked})}
              className="mt-1 w-4 h-4 bg-itemsCard border border-white/20 rounded focus:ring-white/30 focus:ring-2"
            />
            <div>
              <label htmlFor="publishToCommunity" className="text-white text-sm font-medium cursor-pointer">
                Publicar en la comunidad
              </label>
              <p className="text-quaternary text-xs mt-1">
                Comparte tu rutina con otros usuarios
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/10">
          <div className="flex gap-3">
            
            <Button
              isWhite={true}
              action={handleSubmit}
              isWidthFull={true}
              isBlocked={!formData.name || !formData.category || !formData.difficulty}
              onlyMobileText
            >
              Continuar a selección de ejercicios
            </Button>

            <Button
              isWhite={false}
              action={onClose}
              isWidthFull={true}
            >
              Cancelar
            </Button>
          </div>
          {showSaveChanges && (
            <div className="mt-3 space-y-3">
              <Button
                isWhite={false}
                isWidthFull={true}
                isBlocked={!isDirty}
                action={() => onSaveChanges && onSaveChanges(formData)}
              >
                Guardar cambios
              </Button>
              
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-all cursor-pointer"
                >
                  <LuTrash2 size={16} />
                  <span className="text-sm font-medium">Eliminar rutina</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}