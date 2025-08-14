
import { LuArrowRight, LuDumbbell } from "react-icons/lu"


export const MyRoutinesCard = () => {
  return (
    <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20  h-[17em] md:h-[19em] flex flex-col ">
      {/* Header con icono, título y enlace */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LuDumbbell className="md:text-[1.1em] lg:text-[1.2em]" />
          <h3 className="text-[15px] lg:text-[18px]">Mis rutinas</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
          <span className="text-[13px] md:text-[1em]">Ver todas</span>
          <LuArrowRight className="text-xs" />
        </div>
      </div>

      {/* Lista de rutinas */}
      <div className="space-y-3 pb-8">
        {/* Rutina 1 */}
        <div className="bg-itemsCard flex flex-col justify-center rounded-lg pl-4 cursor-pointer hover:bg-itemsCard/80 transition-colors md:h-[3.5em]">
          <h4 className="text-[13px] py-[1.5px] md:py-0 md:text-[15px] mb-1">Tren Superior</h4>
          <p className="text-[13px] py-[1.5px] md:py-0 md:text-sm text-gray-300">hace 2 días</p>
        </div>

        {/* Rutina 2 */}
        <div className="bg-itemsCard flex flex-col justify-center rounded-lg pl-4 cursor-pointer hover:bg-itemsCard/80 transition-colors md:h-[3.5em]">
          <h4 className="text-[13px] py-[1.5px] md:py-0 md:text-[15px] mb-1">Tren Superior</h4>
          <p className="text-[13px] py-[1.5px] md:py-0 md:text-sm text-gray-300">hace 2 días</p>
        </div>

        {/* Rutina 3 */}
        <div className="bg-itemsCard flex flex-col justify-center rounded-lg pl-4 cursor-pointer hover:bg-itemsCard/80 transition-colors md:h-[3.5em]">
          <h4 className="text-[13px] py-[1.5px] md:py-0 md:text-[15px] mb-1">Tren Superior</h4>
          <p className="text-[13px] py-[1.5px] md:py-0 md:text-sm text-gray-300">hace 2 días</p>
        </div>
      </div>
    </div>
  )
}