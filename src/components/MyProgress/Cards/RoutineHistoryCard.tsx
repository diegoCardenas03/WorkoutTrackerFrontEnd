import { LuHistory, LuDumbbell } from "react-icons/lu"
import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { RutinaService } from "../../../services/RutinaService"
import type { RutinaResponseDTO } from "../../../types/rutina/RutinaResponseDTO"
import { Spinner } from "../../Spinner"

const rutinaService = new RutinaService()

export const RoutineHistoryCard = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [completedRoutines, setCompletedRoutines] = useState<RutinaResponseDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const loadCompletedRoutines = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        })

        const routines = await rutinaService.getCompletedRoutines(token)
        setCompletedRoutines(routines)
      } catch (error) {
        console.error('Error al cargar rutinas completadas:', error)
        setCompletedRoutines([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCompletedRoutines()
  }, [getAccessTokenSilently])

  // Ordenar alfabéticamente por nombre
  const sortedRoutines = [...completedRoutines].sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  // Mostrar solo las últimas 5 o todas
  const displayedRoutines = showAll ? sortedRoutines : sortedRoutines.slice(0, 5)

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'principiante':
        return 'text-green-400 border-green-400'
      case 'intermedio':
        return 'text-yellow-400 border-yellow-400'
      case 'avanzado':
        return 'text-red-400 border-red-400'
      default:
        return 'text-blue-400 border-blue-400'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-tertiary w-full rounded-lg p-6 text-white border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <LuHistory size={24} className="text-blue-400" />
          <h3 className="text-lg font-medium">Historial de Rutinas</h3>
        </div>
        <div className="flex justify-center py-8">
          <Spinner size="sm" message="Cargando historial..." />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-tertiary w-full rounded-lg p-6 text-white border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LuHistory size={24} className="text-blue-400" />
          <h3 className="text-lg font-medium">Historial de Rutinas</h3>
        </div>
        <div className="text-quaternary text-sm">
          {completedRoutines.length} completadas
        </div>
      </div>

      {/* Lista de rutinas */}
      {completedRoutines.length === 0 ? (
        <div className="text-center py-8">
          <LuDumbbell size={48} className="mx-auto text-quaternary/40 mb-3" />
          <p className="text-quaternary text-sm">
            Aún no has completado ninguna rutina
          </p>
          <p className="text-quaternary text-xs mt-2">
            ¡Completa tu primera rutina para verla aquí!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedRoutines.map((routine) => (
              <div
                key={routine.id}
                className="bg-itemsCard rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm md:text-base mb-1">
                      {routine.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {routine.difficulty && (
                        <span className={`px-2 py-0.5 rounded-full border ${getDifficultyColor(routine.difficulty)}`}>
                          {routine.difficulty}
                        </span>
                      )}
                      {routine.category && (
                        <span className="text-quaternary">
                          • {routine.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="flex items-center gap-4 text-quaternary text-xs mt-2">
                  {routine.sessions && routine.sessions.length > 0 && (
                    <span>
                      {routine.sessions.reduce((sum, session) => 
                        sum + (session.sessionExercises?.length || 0), 0
                      )} ejercicios
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botón para ver más/menos */}
          {completedRoutines.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showAll 
                ? 'Ver menos ↑' 
                : `Ver todas (${completedRoutines.length}) ↓`
              }
            </button>
          )}
        </>
      )}
    </div>
  )
}
