import { useSelector } from "react-redux"
import type { RootState } from "../../../store"
import { useMemo } from "react"

export const ResumeCard = () => {
  const agenda = useSelector((state: RootState) => state.agenda)
  const peso = useSelector((state: RootState) => state.peso)
  
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
  
  // Calcular peso perdido del mes (primer registro - último registro del mes)
  const weightLost = useMemo(() => {
    const weightsThisMonth = (peso.weights ?? []).filter(w => {
      const weightDate = new Date(w.createdAt)
      return weightDate.getMonth() === currentMonth && 
             weightDate.getFullYear() === currentYear
    }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    
    if (weightsThisMonth.length < 2) return 0
    
    const firstWeight = weightsThisMonth[0].bodyWeight
    const lastWeight = weightsThisMonth[weightsThisMonth.length - 1].bodyWeight
    
    // Positivo = perdido, Negativo = ganado
    return firstWeight - lastWeight
  }, [peso.weights, currentMonth, currentYear])
  
  return (
    <div className="bg-tertiary rounded-lg p-6 pb-12 text-white w-full border border-white/20">
      {/* Header */}
      <h3 className="text-white text-[15px] md:text-[1.2em] 2xl:text-[1.5em] font-medium mb-8">Resumen del progreso</h3>
      
      {/* Estadísticas */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:px-30 lg:px-50">
        {/* Peso perdido */}
        <div className="text-center">
          <div className={`md:text-[1.3em] lg:text-[1.5em] font-bold mb-1 ${
            weightLost > 0 ? 'text-green-400' : weightLost < 0 ? 'text-red-400' : 'text-quaternary'
          }`}>
            {weightLost > 0 ? `-${weightLost.toFixed(1)}kg` : 
             weightLost < 0 ? `+${Math.abs(weightLost).toFixed(1)}kg` : 
             '0kg'}
          </div>
          <div className="text-quaternary text-sm">Peso perdido</div>
        </div>
        
        {/* Entrenamientos completados */}
        <div className="text-center">
          <div className="text-blue-400 md:text-[1.3em] lg:text-[1.5em] font-bold mb-1">{completedTrainings}</div>
          <div className="text-quaternary text-sm">Entrenamientos completados</div>
        </div>
      </div>
    </div>
  )
}