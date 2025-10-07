import { LuArrowRight, LuSearch, LuTarget } from "react-icons/lu"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

export const FeaturedExercisesCard = () => {
  const navigate = useNavigate()
  const exercises = useSelector((state: RootState) => state.exercises?.exercises ?? [])

  // Seleccionar 4 ejercicios aleatorios
  const featuredExercises = useMemo(() => {
    if (exercises.length === 0) return []
    
    // Hacer una copia y mezclar aleatoriamente
    const shuffled = [...exercises].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4)
  }, [exercises])

  return (
    <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20 h-[17em] md:h-[19em] flex flex-col">
      {/* Header con icono, título y enlace */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LuSearch className="md:text-[1.1em] lg:text-[1.2em]" />
          <h3 className="text-[15px] lg:text-[18px]">Ejercicios destacados</h3>
        </div>
        <div 
          className="flex items-center gap-1 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
          onClick={() => navigate('/catalog')}
        >
          <span className="text-[13px] md:text-[1em]">Ver catálogo</span>
          <LuArrowRight className="text-xs" />
        </div>
      </div>

      {/* Grid de ejercicios */}
      <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
        {featuredExercises.length > 0 ? (
          featuredExercises.map((exercise) => (
            <div 
              key={exercise.id}
              className="bg-itemsCard rounded-lg p-3 cursor-pointer hover:bg-itemsCard/80 transition-colors"
              onClick={() => navigate('/catalog')}
            >
              <div className="flex items-center gap-2 mb-1">
                <LuTarget />
                <h4 className="font-semibold text-[11px] md:text-sm truncate">
                  {exercise.name}
                </h4>
              </div>
              <p className="text-xs text-gray-300 truncate">
                {exercise.targetMuscles?.[0]?.name || 'General'}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center">
            <p className="text-sm text-gray-300 text-center">
              No hay ejercicios disponibles
            </p>
          </div>
        )}
      </div>

      {/* Enlace para explorar más */}
      <div className="text-center">
        <span 
          className="text-[13px] md:text-[1em] text-gray-300 cursor-pointer hover:text-white transition-colors"
          onClick={() => navigate('/catalog')}
        >
          Explorar más ejercicios
        </span>
      </div>
    </div>
  )
}