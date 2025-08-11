import { LuTrendingUp } from "react-icons/lu"

export const ProgressCard = () => {
  return (
    <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20 h-[17em] md:h-[19em] flex flex-col">
      {/* Header con icono y título */}
      <div className="flex items-center gap-3 mb-6">
        <LuTrendingUp className="md:text-[1.1em] mlg:text-[1.2em]"/>
        <h3 className="text-[15px] lg:text-[18px]">Progreso</h3>
      </div>

      {/* Objetivo semanal */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Objetivo semanal</span>
          <span className="text-sm text-gray-300">4/5 días</span>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div className="bg-white h-2 rounded-full"></div>
        </div>
      </div>

     

      {/* Mensaje motivacional */}
      <p className="text-sm text-quaternary text-center pt-6 pb-15">
        ¡Excelente trabajo esta semana!
      </p>
    </div>
  )
}