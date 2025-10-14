import { IoClose } from "react-icons/io5"
import { LuDumbbell } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"
import { Button } from "../../Button"
import type { EjercicioResponseDTO } from "../../../types/ejercicio/EjercicioResponseDTO"

interface ExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  exercise: EjercicioResponseDTO | null
  onWatchVideo?: () => void
  showBackButton?: boolean
  onBack?: () => void
}

export const ExerciseModal = ({
  isOpen,
  onClose,
  exercise,
  onWatchVideo,
  showBackButton,
  onBack
}: ExerciseModalProps) => {
  
  if (!isOpen || !exercise) return null

  // Adaptar datos del ejercicio para el modal
  const equipmentLabel = exercise.equipment?.[0]?.name || "Sin equipo"
  const equipmentColor = "orange" as const
  const targetMuscles = exercise.targetMuscles?.map(m => m.name) || []
  const instructions = exercise.instructions ? Object.values(exercise.instructions) : []
  const tips = exercise.tips || ""
  const description = exercise.description

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-primary border border-white/20 rounded-lg w-full max-w-lg mx-auto shadow-2xl max-h-[90vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Header */}
        <div className="sticky top-0 rounded-t-lg p-6 pb-4 border-b border-white/10 bg-primary">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <LuDumbbell className="text-white" size={24} />
              <h2 className="text-white text-[16px] md:text-xl font-medium">{exercise.name}</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-quaternary hover:text-white transition-colors cursor-pointer"
            >
              <IoClose className="text-[18px] md:text-[24px]" />
            </button>
          </div>

          {/* Tags de dificultad y equipo */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-quaternary text-[12px] md:text-sm block mb-1">Equipo necesario</span>
              <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-medium border ${getTagStyles(equipmentColor)}`}>
                {equipmentLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Descripción */}
          <div>
            <h3 className="text-white text-[14px] md:text-base font-medium mb-2">Descripción</h3>
            <p className="text-quaternary text-[12px] md:text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Músculos objetivo */}
          <div>
            <h3 className="text-white text-[14px] md:text-base font-medium mb-3">Músculos objetivo</h3>
            <div className="flex flex-wrap gap-2">
              {targetMuscles.map((muscle, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-linksNavbar text-quaternary rounded-full text-xs "
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Instrucciones */}
          <div>
            <h3 className="text-white text-[14px] md:text-base font-medium mb-3">Instrucciones</h3>
            <ol className="space-y-2">
              {instructions.map((instruction, index) => (
                <li key={index} className="text-quaternary text-[12px] md:text-sm flex gap-3">
                  <span className="text-quaternary font-medium min-w-[20px]">{index + 1}.</span>
                  <span className="leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Consejos */}
          <div>
            <h3 className="text-white text-[14px] md:text-base font-medium mb-2">Consejos</h3>
            <p className="text-quaternary text-[12px] md:text-sm leading-relaxed">
              {tips}
            </p>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="sticky bottom-0 rounded-b-lg p-6 pt-4 border-t border-white/10 bg-primary">
          <div className="flex flex-col gap-3">
            <Button
              isWhite={false}
              action={onWatchVideo}
              isWidthFull={true}
            >
              Ver video tutorial
            </Button>

            {showBackButton && (
              <Button
                isWhite={false}
                action={onBack ?? onClose}
                isWidthFull={true}
              >
                Volver a la rutina
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}