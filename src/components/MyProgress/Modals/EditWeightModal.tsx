import { useState, useEffect } from "react"
import { IoClose } from "react-icons/io5"
import { Button } from "../../Button"
import { LuSave } from "react-icons/lu"
import { useBodyWeight } from "../../../hooks/useBodyWeight"

interface EditWeightModalProps {
  isOpen: boolean
  onClose: () => void
  currentWeight: number
  onSuccess?: () => void
}

export const EditWeightModal = ({ isOpen, onClose, currentWeight, onSuccess }: EditWeightModalProps) => {
  const [weight, setWeight] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { updateLastBodyWeight, refetch } = useBodyWeight()

  useEffect(() => {
    if (isOpen && currentWeight) {
      setWeight(currentWeight.toString())
    }
  }, [isOpen, currentWeight])

  const handleSave = async () => {
    if (weight && Number(weight) > 0) {
      setIsSaving(true)
      try {
        const success = await updateLastBodyWeight(Number(weight))
        if (success) {
          await refetch()
          onSuccess?.() // Llamar callback de éxito
          onClose()
        }
      } catch (error) {
        console.error('Error al actualizar peso:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleCancel = () => {
    setWeight(currentWeight.toString())
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 "
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-primary rounded-lg w-full max-w-md mx-auto p-6 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white  md:text-xl font-medium">Editar último peso</h2>
          <button 
            onClick={onClose}
            className="text-quaternary hover:text-white transition-colors cursor-pointer"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Peso */}
          <div>
            <label htmlFor="weight" className="block text-quaternary text-sm mb-2">
              Peso (kg)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              placeholder="78.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              disabled={isSaving}
              className="w-full h-12 px-4 bg-itemsCard rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-quaternary text-xs mt-2">
              Solo puedes editar tu último registro de peso
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
          <Button
            isWhite={true}
            icon={<LuSave size={16} />}
            iconPosition={false}
            action={handleSave}
            isBlocked={!weight || isSaving || Number(weight) <= 0}
            mobileText="text-sm"
            lgPaddingLine="lg:px-10"
          >
            {isSaving ? 'Guardando...' : 'Actualizar'}
          </Button>
          
          <Button
            isWhite={false}
            lgPaddingLine="lg:px-10"
            action={handleCancel}
            isBlocked={isSaving}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
