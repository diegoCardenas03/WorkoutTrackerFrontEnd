import { LuArrowRight, LuDumbbell } from "react-icons/lu"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

export const MyRoutinesCard = () => {
  const navigate = useNavigate()
  const routines = useSelector((state: RootState) => state.routines?.routines ?? [])
  const agendaItems = useSelector((state: RootState) => state.agenda?.items ?? [])

  // Obtener las últimas 3 rutinas usadas (basado en agenda)
  const recentRoutines = useMemo(() => {
    const routineLastUsed: Record<number, Date> = {}
    const now = new Date()
    
    // Encontrar la última vez que se usó cada rutina (solo sesiones pasadas)
    agendaItems.forEach(item => {
      const routineId = item.routine?.id
      if (routineId) {
        const date = new Date(item.startDate)
        // Solo considerar sesiones pasadas o del día actual
        if (date <= now) {
          if (!routineLastUsed[routineId] || date > routineLastUsed[routineId]) {
            routineLastUsed[routineId] = date
          }
        }
      }
    })

    // Ordenar rutinas por última vez usada
    const sortedRoutines = routines
      .filter(r => routineLastUsed[r.id])
      .map(r => ({
        ...r,
        lastUsed: routineLastUsed[r.id]
      }))
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
      .slice(0, 3)

    // Si hay menos de 3, completar con rutinas sin usar
    if (sortedRoutines.length < 3) {
      const unusedRoutines = routines
        .filter(r => !routineLastUsed[r.id])
        .slice(0, 3 - sortedRoutines.length)
        .map(r => ({ ...r, lastUsed: null }))
      
      return [...sortedRoutines, ...unusedRoutines]
    }

    return sortedRoutines
  }, [routines, agendaItems])

  const formatTimeAgo = (date: Date | null): string => {
    if (!date) return "Sin usar"
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Hoy"
    if (diffDays === 1) return "Ayer"
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    return `Hace ${Math.floor(diffDays / 30)} meses`
  }

  return (
    <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20  h-[17em] md:h-[19em] flex flex-col ">
      {/* Header con icono, título y enlace */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LuDumbbell className="md:text-[1.1em] lg:text-[1.2em]" />
          <h3 className="text-[15px] lg:text-[18px]">Mis rutinas</h3>
        </div>
        <div 
          className="flex items-center gap-1 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
          onClick={() => navigate('/my-routines')}
        >
          <span className="text-[13px] md:text-[1em]">Ver todas</span>
          <LuArrowRight className="text-xs" />
        </div>
      </div>

      {/* Lista de rutinas */}
      <div className="space-y-3 pb-8">
        {recentRoutines.length > 0 ? (
          recentRoutines.map((routine) => (
            <div 
              key={routine.id}
              className="bg-itemsCard flex flex-col justify-center rounded-lg pl-4 cursor-pointer hover:bg-itemsCard/80 transition-colors md:h-[3.5em]"
              onClick={() => navigate('/my-routines')}
            >
              <h4 className="text-[13px] py-[1.5px] md:py-0 md:text-[15px] mb-1">
                {routine.name}
              </h4>
              <p className="text-[13px] py-[1.5px] md:py-0 md:text-sm text-gray-300">
                {formatTimeAgo(routine.lastUsed || null)}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-300 text-center">
              No tienes rutinas creadas.<br/>
              ¡Crea tu primera rutina!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}