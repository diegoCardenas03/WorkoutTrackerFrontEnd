import { IoClose } from "react-icons/io5"
import { LuDumbbell, LuChevronLeft, LuChevronRight, LuPlay } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"
import { Button } from "../../Button"
import type { EjercicioResponseDTO } from "../../../types/ejercicio/EjercicioResponseDTO"
import { useState } from "react"

interface ExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  exercise: EjercicioResponseDTO | null
  showBackButton?: boolean
  onBack?: () => void
}

export const ExerciseModal = ({
  isOpen,
  onClose,
  exercise,
  showBackButton,
  onBack
}: ExerciseModalProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  
  if (!isOpen || !exercise) return null

  // Adaptar datos del ejercicio para el modal
  const equipmentList = exercise.equipment || []
  const targetMuscles = exercise.targetMuscles?.map(m => m.name) || []
  const instructions = exercise.instructions ? Object.values(exercise.instructions) : []
  const tips = exercise.tips || ""
  const description = exercise.description
  const sampleVideos = exercise.sampleVideos || []
  const hasMultipleVideos = sampleVideos.length > 1

  const handlePreviousVideo = () => {
    setCurrentVideoIndex((prev) => (prev > 0 ? prev - 1 : sampleVideos.length - 1))
  }

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev < sampleVideos.length - 1 ? prev + 1 : 0))
  }

  const handleWatchCurrentVideo = () => {
    if (sampleVideos.length > 0) {
      window.open(sampleVideos[currentVideoIndex], "_blank")
    }
  }

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

          {/* Tags de equipo necesario */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-quaternary text-[12px] md:text-sm block mb-2">Equipo necesario</span>
              <div className="flex flex-wrap gap-1.5">
                {equipmentList.length > 0 ? (
                  equipmentList.map((equipment, index) => (
                    <span
                      key={index}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium border ${getTagStyles('orange')}`}
                    >
                      {equipment.name}
                    </span>
                  ))
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium border border-quaternary text-quaternary">
                    Sin equipo
                  </span>
                )}
              </div>
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
            <div className="flex flex-wrap gap-1.5">
              {targetMuscles.map((muscle, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 bg-linksNavbar text-quaternary rounded-full text-[10px] md:text-xs"
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
            {/* Video selector si hay múltiples videos */}
            {hasMultipleVideos && (
              <div className="bg-itemsCard rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-quaternary text-sm">
                    Video {currentVideoIndex + 1} de {sampleVideos.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviousVideo}
                      className="p-2 bg-tertiary hover:bg-white/10 text-white rounded transition-colors"
                      aria-label="Video anterior"
                    >
                      <LuChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextVideo}
                      className="p-2 bg-tertiary hover:bg-white/10 text-white rounded transition-colors"
                      aria-label="Video siguiente"
                    >
                      <LuChevronRight size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Botones numerados para selección directa */}
                <div className="flex gap-2 flex-wrap">
                  {sampleVideos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`min-w-[40px] h-10 px-3 rounded font-medium text-sm transition-all ${
                        currentVideoIndex === index
                          ? 'bg-white text-black'
                          : 'bg-tertiary text-quaternary hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              isWhite={false}
              action={handleWatchCurrentVideo}
              isWidthFull={true}
              icon={<LuPlay size={16} />}
              iconPosition={false}
              isBlocked={sampleVideos.length === 0}
            >
              {hasMultipleVideos 
                ? `Ver video ${currentVideoIndex + 1}` 
                : 'Ver video tutorial'}
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