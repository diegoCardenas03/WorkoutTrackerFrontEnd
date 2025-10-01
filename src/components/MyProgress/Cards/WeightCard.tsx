import { TbTrendingDown, TbTrendingUp } from "react-icons/tb"
import { useBodyWeight } from "../../../hooks/useBodyWeight"

export const WeightCard = () => {
  const { getCurrentWeight, getTotalWeightChange, isLoading } = useBodyWeight();
  
  const currentWeight = getCurrentWeight();
  const totalChange = getTotalWeightChange();
  const isTrendingDown = totalChange < 0;
  
  // Calcular porcentaje de progreso (ejemplo: si el objetivo es perder 10kg)
  const targetWeightLoss = 10; // kg objetivo a perder
  const progressPercentage = Math.min(Math.abs(totalChange) / targetWeightLoss * 100, 100);

  if (isLoading) {
    return (
      <div className="bg-tertiary rounded-lg p-6 2xl:p-10 w-full text-white border border-white/20 flex items-center justify-center min-h-[160px]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-quaternary"></div>
      </div>
    );
  }

  if (!currentWeight) {
    return (
      <div className="bg-tertiary rounded-lg p-6 2xl:p-10 w-full text-white border border-white/20 min-h-[160px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-quaternary text-[12px] md:text-sm font-light">Peso corporal</h3>
            <p className="text-white/60 text-sm mt-2">Sin registros de peso</p>
            <p className="text-quaternary text-xs mt-1">Registra tu primer peso para comenzar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tertiary rounded-lg p-6 2xl:p-10 w-full text-white border border-white/20 min-h-[160px]">
      {/* Header con título y icono */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-quaternary text-[12px] md:text-sm font-light">Peso corporal</h3>
          <div className="flex items-baseline gap-1">
            <span className="md:text-[1.3em] lg:text-[1.5em] font-bold text-white">
              {currentWeight.bodyWeight.toFixed(1)}kg
            </span>
          </div>
          {totalChange !== 0 ? (
            <div className="flex items-center gap-1 mt-1">
              {isTrendingDown ? (
                <>
                  <TbTrendingDown className="text-green-400 text-xs" size={12} />
                  <p className="text-green-400 font-light text-[10px] md:text-xs">
                    {totalChange.toFixed(1)}kg
                  </p>
                </>
              ) : (
                <>
                  <TbTrendingUp className="text-red-400 text-xs" size={12} />
                  <p className="text-red-400 font-light text-[10px] md:text-xs">
                    +{totalChange.toFixed(1)}kg
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="h-[16px] mt-1"></div>
          )}
        </div>
        <div className={isTrendingDown ? "text-green-400" : "text-red-400"}>
          {isTrendingDown ? <TbTrendingDown size={24} /> : <TbTrendingUp size={24} />}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-4">
        <div className="w-full bg-bgbar rounded-full h-[6px] md:h-2">
          <div 
            className="bg-white h-[6px] md:h-2 rounded-l transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}