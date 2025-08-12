import { useState } from "react"
import { IoClose } from "react-icons/io5"
import { Button } from "../../Button"
import { LuSave } from "react-icons/lu"

interface WeightRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (weight: string, date: string) => void
}

export const WeightRegisterModal = ({ isOpen, onClose, onSave }: WeightRegisterModalProps) => {
  const [weight, setWeight] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSave = () => {
    if (weight && date) {
      onSave(weight, date)
      setWeight("")
      setDate(new Date().toISOString().split('T')[0])
      onClose()
    }
  }

  const handleCancel = () => {
    setWeight("")
    setDate(new Date().toISOString().split('T')[0])
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
          <h2 className="text-white  md:text-xl font-medium">Registrar nuevo peso</h2>
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
              className="w-full h-12 px-4 bg-itemsCard rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
            />
          </div>

          {/* Fecha */}
          <div>
            <label htmlFor="date" className="block text-quaternary text-sm mb-2">
              Fecha
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 px-4 bg-itemsCard rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
          <Button
            isWhite={true}
            icon={<LuSave size={16} />}
            iconPosition={false}
            action={handleSave}
            isBlocked={!weight || !date}
            mobileText="text-sm"
            lgPaddingLine="lg:px-10"
          >
            Guardar
          </Button>
          
          <Button
          isWhite={false}
          lgPaddingLine="lg:px-10"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}