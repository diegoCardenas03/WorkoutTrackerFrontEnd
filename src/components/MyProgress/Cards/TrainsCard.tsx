import { LuActivity } from "react-icons/lu"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store"
import { useEffect, useState, useMemo } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { progresoService } from "../../../services/ProgresoService"

export const TrainsCard = () => {
  const agenda = useSelector((state: RootState) => state.agenda)
  const { getAccessTokenSilently } = useAuth0()
  const [completedRoutinesCount, setCompletedRoutinesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Obtener fecha del mes actual
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // Calcular entrenamientos completados del mes desde la agenda
  const monthlyScheduledProgress = useMemo(() => {
    return (agenda.items ?? []).filter(item => {
      const itemDate = new Date(item.startDate)
      return item.completed && 
             itemDate.getMonth() === currentMonth && 
             itemDate.getFullYear() === currentYear
    }).length
  }, [agenda.items, currentMonth, currentYear])
  
  // Cargar rutinas completadas del mes desde el backend
  useEffect(() => {
    const loadCompletedRoutines = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        })

        // Obtener primer y último día del mes actual
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

        const completedRoutines = await progresoService.getCompletedRoutines(
          token,
          startOfMonth.toISOString(),
          endOfMonth.toISOString()
        )

        setCompletedRoutinesCount(completedRoutines.length)
      } catch (error) {
        console.error('Error al cargar rutinas completadas:', error)
        setCompletedRoutinesCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadCompletedRoutines()
  }, [getAccessTokenSilently, now])
  
  // Total de rutinas completadas = desde agenda + adicionales
  const totalCompletedTrainings = monthlyScheduledProgress + completedRoutinesCount
  
  if (isLoading) {
    return (
      <div className="bg-tertiary w-full rounded-lg p-6 2xl:p-10 text-white border border-white/20 min-h-[160px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-quaternary text-[12px] md:text-sm font-light">Entrenamientos</h3>
            <span className="text-quaternary text-xs">Cargando...</span>
          </div>
          <div className="text-blue-400">
            <LuActivity size={24} />
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-tertiary w-full rounded-lg p-6 2xl:p-10 text-white border border-white/20 min-h-[160px]">
      {/* Header con título y icono */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-quaternary text-[12px] md:text-sm font-light">Rutinas Completadas</h3>
          <div className="flex items-baseline gap-1">
            <span className="md:text-[1.3em] lg:text-[1.5em] font-bold text-white">{totalCompletedTrainings}</span>
          </div>
          <p className="text-quaternary font-light text-[10px] md:text-xs mt-1">
            este mes
          </p>
          
          {/* Detalles si hay datos */}
          {(monthlyScheduledProgress > 0 || completedRoutinesCount > 0) && (
            <div className="space-y-0.5 text-quaternary font-light text-[9px] md:text-[10px] mt-2">
              {monthlyScheduledProgress > 0 && (
                <p>• {monthlyScheduledProgress} desde agenda</p>
              )}
              {completedRoutinesCount > 0 && (
                <p>• {completedRoutinesCount} adicionales</p>
              )}
            </div>
          )}
        </div>
        <div className="text-blue-400">
          <LuActivity size={24} />
        </div>
      </div>
    </div>
  )
}