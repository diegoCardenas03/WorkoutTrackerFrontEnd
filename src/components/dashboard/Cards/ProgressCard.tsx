import { LuTrendingUp } from "react-icons/lu"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store"
import { useMemo, useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { RutinaService } from "../../../services/RutinaService"

const rutinaService = new RutinaService()

export const ProgressCard = () => {
  const agendaItems = useSelector((state: RootState) => state.agenda?.items ?? [])
  const { getAccessTokenSilently } = useAuth0()
  const [completedRoutinesCount, setCompletedRoutinesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Calcular entrenamientos completados del mes (de la agenda)
  const monthlyScheduledProgress = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    // Filtrar entrenamientos del mes actual
    const monthSessions = agendaItems.filter(item => {
      const date = new Date(item.startDate)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const completedCount = monthSessions.filter(s => s.completed).length
    return completedCount
  }, [agendaItems])

  // Cargar rutinas completadas del mes
  useEffect(() => {
    const loadCompletedRoutines = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        })

        const allCompleted = await rutinaService.getCompletedRoutines(token)
        
        // Simplemente contar todas las rutinas completadas
        setCompletedRoutinesCount(allCompleted.length)
      } catch (error) {
        console.error('Error al cargar rutinas completadas:', error)
        setCompletedRoutinesCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadCompletedRoutines()
  }, [getAccessTokenSilently])

  // Total de entrenamientos = sesiones agendadas completadas + rutinas completadas adicionales
  const totalCompletedTrainings = monthlyScheduledProgress + completedRoutinesCount

  // Obtener nombre del mes actual
  const currentMonthName = useMemo(() => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return monthNames[new Date().getMonth()]
  }, [])

  if (isLoading) {
    return (
      <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20 h-[17em] md:h-[19em] flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <LuTrendingUp className="md:text-[1.1em] mlg:text-[1.2em]"/>
          <h3 className="text-[15px] lg:text-[18px]">Progreso</h3>
        </div>
        <div className="text-quaternary text-sm text-center">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20 h-[17em] md:h-[19em] flex flex-col">
      {/* Header con icono y título */}
      <div className="flex items-center gap-3 mb-6">
        <LuTrendingUp className="md:text-[1.1em] mlg:text-[1.2em]"/>
        <h3 className="text-[15px] lg:text-[18px]">Progreso</h3>
      </div>

      {/* Rutinas completadas del mes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Rutinas de {currentMonthName}</span>
          <span className="text-2xl font-bold text-white">
            {totalCompletedTrainings}
          </span>
        </div>
        
        {/* Información detallada */}
        {(monthlyScheduledProgress > 0 || completedRoutinesCount > 0) && (
          <div className="space-y-1 text-quaternary text-xs mt-2">
            {monthlyScheduledProgress > 0 && (
              <p>• {monthlyScheduledProgress} desde agenda</p>
            )}
            {completedRoutinesCount > 0 && (
              <p>• {completedRoutinesCount} adicionales</p>
            )}
          </div>
        )}
      </div>

      {/* Mensaje motivacional */}
      <p className="text-sm text-quaternary text-center pt-6 pb-15">
        {totalCompletedTrainings === 0
          ? "¡Empieza hoy tu primer entrenamiento!"
          : totalCompletedTrainings >= 12
            ? "¡Increíble dedicación! 💪🔥"
            : totalCompletedTrainings >= 8
              ? "¡Excelente trabajo este mes! 💪"
              : totalCompletedTrainings >= 4
                ? "¡Sigue así, vas muy bien! 🔥"
                : "¡Buen comienzo, continúa! 💪"}
      </p>
    </div>
  )
}