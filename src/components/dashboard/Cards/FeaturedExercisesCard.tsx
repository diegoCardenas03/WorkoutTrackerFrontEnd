
import { LuArrowRight, LuSearch, LuTarget } from "react-icons/lu"

export const FeaturedExercisesCard = () => {
  return (
    <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20 h-[17em] md:h-[19em] flex flex-col">
      {/* Header con icono, título y enlace */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LuSearch className="md:text-[1.1em] lg:text-[1.2em]" />
          <h3 className="text-[15px] lg:text-[18px]">Ejercicios destacados</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
          <span className="text-[13px] md:text-[1em]">Ver catálogo</span>
          <LuArrowRight className="text-xs" />
        </div>
      </div>

      {/* Grid de ejercicios */}
      <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
        {/* Press de banca */}
        <div className="bg-itemsCard rounded-lg p-3 cursor-pointer hover:bg-itemsCard/80 transition-colors">
          <div className="flex items-center gap-2 mb-1">
          
             <LuTarget />
            
            <h4 className="font-semibold text-[11px] md:text-sm">Press de banca</h4>
          </div>
          <p className="text-xs text-gray-300">Pecho</p>
        </div>

        {/* Sentadillas */}
        <div className="bg-itemsCard rounded-lg p-3 cursor-pointer hover:bg-itemsCard/80 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            
             <LuTarget />
            
            <h4 className="font-semibold text-[11px] md:text-sm">Sentadillas</h4>
          </div>
          <p className="text-xs text-gray-300">Piernas</p>
        </div>

        {/* Peso muerto */}
        <div className="bg-itemsCard rounded-lg p-3 cursor-pointer hover:bg-itemsCard/80 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            
             <LuTarget />
            
            <h4 className="font-semibold text-[11px] md:text-sm">Peso muerto</h4>
          </div>
          <p className="text-xs text-gray-300">Espalda</p>
        </div>

        {/* Press militar */}
        <div className="bg-itemsCard rounded-lg p-3 cursor-pointer hover:bg-itemsCard/80 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            
             <LuTarget />
            
            <h4 className="font-semibold text-[11px] md:text-sm">Press militar</h4>
          </div>
          <p className="text-xs text-gray-300">Hombros</p>
        </div>
      </div>

      {/* Enlace para explorar más */}
      <div className="text-center">
        <span className="text-[13px] md:text-[1em] text-gray-300 cursor-pointer hover:text-white transition-colors">
          Explorar más ejercicios
        </span>
      </div>
    </div>
  )
}