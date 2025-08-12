import { IoDocumentTextOutline } from "react-icons/io5"
import { LuSquarePen, LuTrash2 } from "react-icons/lu"
import { TbTrendingDown } from "react-icons/tb"

export const RegistersCard = () => {
  const registers = [
    { weight: "78.5kg", date: "31/5/2025" },
    { weight: "79.1kg", date: "30/4/2025" },
    { weight: "80.5kg", date: "31/3/2025" },
    { weight: "81.2kg", date: "29/2/2025" }
  ]

  return (
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
            <TbTrendingDown className="text-green-400 text-sm" />
            <span className="text-green-400 text-sm">-0.6kg</span>
          </div>
          
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-quaternary text-sm">Peso inicial</span>
          <span className="text-white text-sm">82kg</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-quaternary text-sm">Peso actual</span>
          <span className="text-white text-sm">78.5kg</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-quaternary text-sm">Total perdido</span>
          <span className="text-green-400 text-sm">-3.5kg</span>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-gray-600/30 my-4"></div>

      {/* Historial */}
      <div>
        <h4 className="text-white text-base font-medium mb-4">Historial</h4>
        
        <div className="space-y-3">
          {registers.map((register, index) => (
            <div key={index} className="bg-linksNavbar p-3 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-white text-sm font-medium">{register.weight}</div>
                <div className="text-quaternary text-xs">{register.date}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="text-white hover:text-white/40 transition-colors cursor-pointer">
                  <LuSquarePen size={16} />
                </button>
                <button className="text-red-400 hover:text-red-800 transition-colors cursor-pointer">
                  <LuTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}