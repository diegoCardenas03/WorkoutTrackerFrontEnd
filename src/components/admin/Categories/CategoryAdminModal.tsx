import { useEffect, useState } from "react"
import { LuX } from "react-icons/lu"

interface Category {
  id: string
  name: string
  active: boolean
}

interface Props {
  isOpen: boolean
  onClose: () => void
  category: Category | null
  onSave: (data: { name: string; active: boolean }) => void
}

export const CategoryAdminModal = ({ isOpen, onClose, category, onSave }: Props) => {
  const [name, setName] = useState("")
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setActive(category.active)
    } else {
      setName("")
      setActive(true)
    }
  }, [category, isOpen])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), active })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-tertiary border border-white/20 rounded-lg w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-xl font-semibold">
            {category ? "Editar Categoría" : "Crear Categoría"}
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
          {/* Nombre */}
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-quaternary mb-2">
              Nombre de la Categoría <span className="text-red-500">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Fuerza, Cardio, Flexibilidad..."
              className="w-full px-4 py-3 bg-primary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 transition-colors"
            />
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
            {category ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  )
}
