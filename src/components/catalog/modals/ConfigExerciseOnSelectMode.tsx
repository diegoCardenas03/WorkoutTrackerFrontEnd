import { useState } from "react"
import { IoClose } from "react-icons/io5"
import { LuMinus, LuPlus } from "react-icons/lu"
import { Button } from "../../Button"
import { getTagStyles } from "../../../utils/getTagStyles"

interface ConfigExerciseOnSelectModeProps {
  isOpen: boolean
  onClose: () => void
  exercise: any
  onAddExercise: (exerciseConfig: any) => void
}

export const ConfigExerciseOnSelectMode = ({
  isOpen,
  onClose,
  exercise,
  onAddExercise
}: ConfigExerciseOnSelectModeProps) => {
  const [series, setSeries] = useState(3)
  const [reps, setReps] = useState(12)
  const [repsError, setRepsError] = useState("")
  const [restKg, setRestKg] = useState("")
  const [restTime, setRestTime] = useState("2") 
  const [notes, setNotes] = useState("")

  const handleAddExercise = () => {
    const exerciseConfig = {
      ...exercise,
      config: {
        series,
        reps: reps.toString(), // Convertir a string para el payload
        restKg,
        restTime,
        notes
      }
    }
    onAddExercise(exerciseConfig)
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
      <div className="relative bg-primary border border-white/20 rounded-lg w-full max-w-sm mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-base sm:text-lg font-medium">🔧 Configurar ejercicio</h2>
            <button 
              onClick={onClose}
              className="text-quaternary hover:text-white transition-colors cursor-pointer"
            >
              <IoClose size={20} />
            </button>
          </div>
          <p className="text-quaternary text-sm">
            Configura las series y repeticiones para {exercise?.title}
          </p>
          
          {/* Tags del ejercicio */}
          <div className="flex flex-wrap gap-2 mt-3">
            {exercise?.tags?.map((tag: any, index: number) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTagStyles(tag.color)}`}
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* Músculos objetivo */}
          {exercise?.targetMuscles && exercise.targetMuscles.length > 0 && (
            <div className="mt-3">
              <p className="text-quaternary text-xs mb-2">Músculos objetivo:</p>
              <div className="flex flex-wrap gap-1.5">
                {exercise.targetMuscles.map((muscle: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-linksNavbar text-quaternary rounded-full text-xs font-medium"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Series y Repeticiones */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-white text-sm font-medium block mb-2">Series</label>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setSeries(Math.max(1, series - 1))}
                  className="w-8 h-8 bg-itemsCard border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <LuMinus size={14} />
                </button>
                <span className="text-white font-medium text-center flex-1">{series}</span>
                <button
                  onClick={() => setSeries(series + 1)}
                  className="w-8 h-8 bg-itemsCard border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <LuPlus size={14} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">Repeticiones</label>
              <div>
                <input
                  type="text"
                  value={reps}
                  onChange={(e) => {
                    const value = e.target.value
                    // Validar que no contenga comas
                    if (value.includes(',') || value.includes('.')) {
                      setRepsError('No se permiten comas ni decimales')
                      return
                    }
                    
                    // Limpiar error si existe
                    if (repsError) setRepsError('')
                    
                    // Validar que sea un número entero válido
                    const numValue = parseInt(value)
                    if (!isNaN(numValue) && numValue >= 1) {
                      setReps(numValue)
                    } else if (value === '') {
                      setReps(0)
                    }
                  }}
                  placeholder="12"
                  className={`w-full p-2 sm:p-3 bg-itemsCard border ${
                    repsError ? 'border-red-500' : 'border-white/20'
                  } rounded-lg text-white text-center placeholder-quaternary focus:outline-none focus:border-white/40 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                {repsError && (
                  <p className="text-red-400 text-xs mt-1">{repsError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Peso y Descanso */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-white text-sm font-medium block mb-2">Peso (kg)</label>
              <input
                type="text"
                value={restKg}
                onChange={(e) => setRestKg(e.target.value)}
                placeholder="0-20"
                className="w-full p-2 sm:p-3 bg-itemsCard border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 text-sm"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">Descanso (min)</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRestTime(Math.max(0, parseInt(restTime) - 1).toString())}
                  className="w-8 h-8 bg-itemsCard border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <LuMinus size={14} />
                </button>
                <input
                  type="text"
                  value={restTime}
                  onChange={(e) => setRestTime(e.target.value)}
                  className="flex-1 min-w-0 p-2 bg-itemsCard border border-white/20 rounded-lg text-white text-center focus:outline-none focus:border-white/40 text-sm"
                />
                <button
                  onClick={() => setRestTime((parseInt(restTime) + 1).toString())}
                  className="w-8 h-8 bg-itemsCard border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <LuPlus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Aumentar peso cada semana"
              rows={3}
              className="w-full p-2 sm:p-3 bg-itemsCard border border-white/20 rounded-lg text-white placeholder-quaternary resize-none focus:outline-none focus:border-white/40 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              isWhite={false}
              action={onClose}
              isWidthFull={true}
            >
              Cancelar
            </Button>
            <Button
              isWhite={true}
              action={handleAddExercise}
              isWidthFull={true}
              lgPaddingLine=""
              mdPaddingLine=""
              isBlocked={!reps || reps < 1 || !!repsError}
              onlyMobileText
            >
              Agregar ejercicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}