import { IoRefreshOutline } from "react-icons/io5"
import { LuLightbulb } from "react-icons/lu"

export const TipDayCard = () => {
  return (
    <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20 h-[17em] md:h-[16em]">
      {/* Header con icono, título y botón de refresh */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LuLightbulb className="md:text-[1.1em] lg:text-[1.2em]" />
          <h3 className="text-[15px] lg:text-[18px]">Tip del día</h3>
        </div>
        <IoRefreshOutline className="text-lg text-gray-300 cursor-pointer hover:text-white transition-colors hover:rotate-180 duration-300" />
      </div>

      {/* Categoría */}
      <div className="mb-4">
        <span className="text-[9px] md:text-[11px] text-gray-300 bg-itemsCard px-2 py-1 rounded-2xl">
          Nutrición
        </span>
      </div>

      {/* Título del tip */}
      <h4 className="text-[16px] md:text-xl font-semibold mb-3">
        Hidratación durante el entrenamiento
      </h4>

      {/* Descripción */}
      <p className="text-[12.5px] md:text-sm text-gray-300 leading-relaxed">
        Bebe pequeños sorbos de agua cada 15-20 minutos durante tu entrenamiento para mantener una hidratación óptima.
      </p>
    </div>
  )
}