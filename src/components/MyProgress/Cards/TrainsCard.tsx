import { LuActivity } from "react-icons/lu"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store"
import { useMemo } from "react"

export const TrainsCard = () => {
  const agenda = useSelector((state: RootState) => state.agenda)
  
  // Obtener fecha del mes actual
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // Calcular entrenamientos completados del mes actual
  const completedTrainings = useMemo(() => {
    return (agenda.items ?? []).filter(item => {
      const itemDate = new Date(item.startDate)
      return item.completed && 
             itemDate.getMonth() === currentMonth && 
             itemDate.getFullYear() === currentYear
    }).length
  }, [agenda.items, currentMonth, currentYear])
  
  // Meta = Total de sesiones del mes (completadas + pendientes)
  const monthlyGoal = useMemo(() => {
    return (agenda.items ?? []).filter(item => {
      const itemDate = new Date(item.startDate)
      return itemDate.getMonth() === currentMonth && 
             itemDate.getFullYear() === currentYear
    }).length
  }, [agenda.items, currentMonth, currentYear])
  
  const progressPercentage = monthlyGoal > 0 ? (completedTrainings / monthlyGoal) * 100 : 0
  
  return (
    <div className="bg-tertiary w-full rounded-lg p-6 2xl:p-10 text-white border border-white/20 min-h-[160px]">
      {/* Header con título y icono */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-quaternary text-[12px] md:text-sm font-light">Entrenamientos</h3>
          <div className="flex items-baseline gap-1">
            <span className="md:text-[1.3em] lg:text-[1.5em] font-bold text-white">{completedTrainings}</span>
          </div>
          <p className="text-quaternary font-light text-[10px] md:text-xs mt-1">
            de {monthlyGoal} {monthlyGoal === 1 ? 'objetivo' : 'objetivos'}
          </p>
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
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}