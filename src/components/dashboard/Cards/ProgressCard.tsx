import { LuTrendingUp } from "react-icons/lu"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store"
import { useMemo } from "react"

export const ProgressCard = () => {
  const agendaItems = useSelector((state: RootState) => state.agenda?.items ?? [])

  // Calcular progreso mensual
  const monthlyProgress = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    // Filtrar entrenamientos del mes actual
    const monthSessions = agendaItems.filter(item => {
      const date = new Date(item.startDate)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const completedCount = monthSessions.filter(s => s.completed).length
    const totalCount = monthSessions.length
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return { completedCount, totalCount, percentage }
  }, [agendaItems])

  // Obtener nombre del mes actual
  const currentMonthName = useMemo(() => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return monthNames[new Date().getMonth()]
  }, [])

  return (
    <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20 h-[17em] md:h-[19em] flex flex-col">
      {/* Header con icono y título */}
      <div className="flex items-center gap-3 mb-6">
        <LuTrendingUp className="md:text-[1.1em] mlg:text-[1.2em]"/>
        <h3 className="text-[15px] lg:text-[18px]">Progreso</h3>
      </div>

      {/* Objetivo mensual */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Entrenamientos de {currentMonthName}</span>
          <span className="text-sm text-gray-300">
            {monthlyProgress.completedCount}/{monthlyProgress.totalCount}
          </span>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300" 
            style={{ width: `${monthlyProgress.percentage}%` }}
          />
        </div>
      </div>

      {/* Mensaje motivacional */}
      <p className="text-sm text-quaternary text-center pt-6 pb-15">
        {monthlyProgress.totalCount === 0 
          ? "¡Agenda tus entrenamientos del mes!" 
          : monthlyProgress.completedCount === 0 
            ? "¡Comienza tus entrenamientos de este mes!" 
            : monthlyProgress.percentage >= 80 
              ? "¡Excelente trabajo este mes!" 
              : monthlyProgress.percentage >= 50
                ? "¡Vas por buen camino!"
                : "¡Sigue adelante, tú puedes!"}
      </p>
    </div>
  )
}