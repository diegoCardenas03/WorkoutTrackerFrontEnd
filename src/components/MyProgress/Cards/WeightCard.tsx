import { TbTrendingDown } from "react-icons/tb"

export const WeightCard = () => {
  return (
    <div className="bg-tertiary rounded-lg p-6 2xl:p-10 w-full text-white border border-white/20">
      {/* Header con título y icono */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-quaternary text-[12px] md:text-sm font-light">Peso corporal</h3>
          <div className="flex items-baseline gap-1">
            <span className="md:text-[1.3em] lg:text-[1.5em] font-bold text-white">78.5kg</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TbTrendingDown className="text-green-400 text-xs" size={12} />
            <p className="text-green-400 font-light text-[10px] md:text-xs">-3.5kg</p>
          </div>
        </div>
        <div className="text-green-400">
          <TbTrendingDown size={24} />
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-4">
        <div className="w-full bg-bgbar rounded-full h-[6px] md:h-2">
          <div 
            className="bg-white h-[6px] md:h-2 rounded-l transition-all duration-300"
            style={{ width: '35%' }}
          ></div>
        </div>
      </div>
    </div>
  )
}