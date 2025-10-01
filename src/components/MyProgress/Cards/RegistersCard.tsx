import { IoDocumentTextOutline } from "react-icons/io5"
import { LuSquarePen } from "react-icons/lu"
import { TbTrendingDown, TbTrendingUp } from "react-icons/tb"
import { useBodyWeight } from "../../../hooks/useBodyWeight"
import { useState } from "react"
import { EditWeightModal } from "../../MyProgress/Modals/EditWeightModal"

export const RegistersCard = () => {
  const { bodyWeights, isLoading, getCurrentWeight, getWeightDifference, getInitialWeight, getTotalWeightChange } = useBodyWeight();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentWeight = getCurrentWeight();
  const initialWeight = getInitialWeight();
  const lastChange = getWeightDifference();
  const totalChange = getTotalWeightChange();

  const formatDate = (timestamp: string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="bg-tertiary rounded-lg p-6 text-white w-full 2xl:w-[46vw] h-[36em] border border-white/20 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quaternary"></div>
      </div>
    );
  }

  if (bodyWeights.length === 0) {
    return (
      <div className="bg-tertiary rounded-lg p-6 text-white w-full 2xl:w-[46vw] h-[36em] border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <IoDocumentTextOutline className="text-white" size={20} />
          <h3 className="text-white text-[15px] md:text-[1.2em] 2xl:text-[1.5em] font-medium">Registros recientes</h3>
        </div>
        <div className="flex items-center justify-center h-[28em]">
          <div className="text-center">
            <p className="text-white/60 text-lg mb-2">Sin registros de peso</p>
            <p className="text-quaternary text-sm">Comienza a registrar tu peso para ver tu progreso</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-tertiary rounded-lg p-6 text-white w-full 2xl:w-[46vw] h-[36em] border border-white/20">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <IoDocumentTextOutline className="text-white" size={20} />
          <h3 className="text-white text-[15px] md:text-[1.2em] 2xl:text-[1.5em] font-medium">Registros recientes</h3>
        </div>

        {/* Estadísticas principales */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-quaternary text-sm">Último cambio</span>
            <div className="flex items-center gap-2">
              {lastChange < 0 ? (
                <>
                  <TbTrendingDown className="text-green-400 text-sm" />
                  <span className="text-green-400 text-sm">{lastChange.toFixed(1)}kg</span>
                </>
              ) : lastChange > 0 ? (
                <>
                  <TbTrendingUp className="text-red-400 text-sm" />
                  <span className="text-red-400 text-sm">+{lastChange.toFixed(1)}kg</span>
                </>
              ) : (
                <span className="text-white text-sm">Sin cambios</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-quaternary text-sm">Peso inicial</span>
            <span className="text-white text-sm">{initialWeight?.bodyWeight.toFixed(1)}kg</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-quaternary text-sm">Peso actual</span>
            <span className="text-white text-sm">{currentWeight?.bodyWeight.toFixed(1)}kg</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-quaternary text-sm">{totalChange < 0 ? 'Total perdido' : 'Total ganado'}</span>
            <span className={totalChange < 0 ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
              {totalChange < 0 ? '' : '+'}{totalChange.toFixed(1)}kg
            </span>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-gray-600/30 my-4"></div>

        {/* Historial */}
        <div>
          <h4 className="text-white text-base font-medium mb-4">Historial</h4>
          
          <div className="space-y-3 max-h-[12em] overflow-y-auto">
            {bodyWeights.slice().reverse().slice(0, 4).map((peso, index) => {
              const isLastRecord = index === 0; // El último registro (más reciente)
              
              return (
                <div key={peso.id} className="bg-linksNavbar p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">{peso.bodyWeight.toFixed(1)}kg</div>
                    <div className="text-quaternary text-xs">{formatDate(peso.id)}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isLastRecord && (
                      <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-white hover:text-white/40 transition-colors cursor-pointer"
                      >
                        <LuSquarePen size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <EditWeightModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentWeight={currentWeight?.bodyWeight || 0}
      />
    </>
  )
}