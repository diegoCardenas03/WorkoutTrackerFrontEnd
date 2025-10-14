import { LuTrendingUp } from "react-icons/lu"
import { useMemo, useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { SesionCompletadaService } from "../../../services/SesionCompletadaService"

const sesionCompletadaService = new SesionCompletadaService()

export const ProgressCard = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Calcular sesiones completadas del mes
  useEffect(() => {
    const loadCompletedSessions = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        })

        const allSessions = await sesionCompletadaService.getAllCompletedSessions(token)
        
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        
        // Filtrar sesiones del mes actual
        const monthlySessions = allSessions.filter(session => {
          const sessionDate = new Date(session.sessionDate)
          return sessionDate.getMonth() === currentMonth && 
                 sessionDate.getFullYear() === currentYear
        })
        
        setCompletedSessionsCount(monthlySessions.length)
      } catch (error) {
        console.error('Error al cargar sesiones completadas:', error)
        setCompletedSessionsCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadCompletedSessions()
  }, [getAccessTokenSilently])

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

      {/* Sesiones completadas del mes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Sesiones de {currentMonthName}</span>
          <span className="text-2xl font-bold text-white">
            {isLoading ? '...' : completedSessionsCount}
          </span>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <p className="text-sm text-quaternary text-center pt-6 pb-15">
        {completedSessionsCount === 0
          ? "¡Empieza hoy tu primer entrenamiento!"
          : completedSessionsCount >= 12
            ? "¡Increíble dedicación! 💪🔥"
            : completedSessionsCount >= 8
              ? "¡Excelente trabajo este mes! 💪"
              : completedSessionsCount >= 4
                ? "¡Sigue así, vas muy bien! 🔥"
                : "¡Buen comienzo, continúa! 💪"}
      </p>
    </div>
  )
}