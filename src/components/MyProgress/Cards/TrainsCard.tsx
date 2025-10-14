import { LuActivity } from "react-icons/lu"
import { useMemo, useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { SesionCompletadaService } from "../../../services/SesionCompletadaService"

const sesionCompletadaService = new SesionCompletadaService()

export const TrainsCard = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Obtener fecha del mes actual
  const now = useMemo(() => new Date(), [])
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // Cargar sesiones completadas del mes
  useEffect(() => {
    const loadCompletedSessions = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        })

        const allSessions = await sesionCompletadaService.getAllCompletedSessions(token)
        
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
  }, [getAccessTokenSilently, currentMonth, currentYear])
  
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
          <h3 className="text-quaternary text-[12px] md:text-sm font-light">Sesiones Completadas</h3>
          <div className="flex items-baseline gap-1">
            <span className="md:text-[1.3em] lg:text-[1.5em] font-bold text-white">{completedSessionsCount}</span>
          </div>
          <p className="text-quaternary font-light text-[10px] md:text-xs mt-1">
            este mes
          </p>
        </div>
        <div className="text-blue-400">
          <LuActivity size={24} />
        </div>
      </div>
    </div>
  )
}