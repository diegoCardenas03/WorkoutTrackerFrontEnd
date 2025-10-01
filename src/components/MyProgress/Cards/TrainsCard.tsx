import { LuActivity } from "react-icons/lu"


export const TrainsCard = () => {
  return (
    <div className="bg-tertiary w-full rounded-lg p-6 2xl:p-10 text-white border border-white/20 min-h-[160px]">
      {/* Header con título y icono */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-quaternary text-[12px] md:text-sm font-light">Entrenamientos</h3>
          <div className="flex items-baseline gap-1">
            <span className="md:text-[1.3em] lg:text-[1.5em] font-bold text-white">28</span>
          </div>
          <p className="text-quaternary font-light text-[10px] md:text-xs mt-1">de 32 objetivos</p>
        </div>
        <div className="text-blue-400">
          <LuActivity size={24} />
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-4">
        <div className="w-full bg-bgbar rounded-full h-[6px] md:h-2">
          <div 
            className="bg-white h-[6px] md:h-2 rounded-l transition-all duration-300"
            style={{ width: `${(28 / 32) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}