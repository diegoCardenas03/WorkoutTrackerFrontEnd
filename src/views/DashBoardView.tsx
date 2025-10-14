import { FeaturedExercisesCard } from "../components/dashboard/Cards/FeaturedExercisesCard"
import { MyRoutinesCard } from "../components/dashboard/Cards/MyRoutinesCard"
import { NextSessionCard } from "../components/dashboard/Cards/NextSessionCard"
import { ProgressCard } from "../components/dashboard/Cards/ProgressCard"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAuth0 } from "@auth0/auth0-react"
import { fetchRoutines } from "../store/slices/routineSlice"
import { fetchAgenda } from "../store/slices/agendaSlice"
import { fetchActiveExercises } from "../store/slices/exerciseSlice"
import type { RootState } from "../store"
import { Spinner } from "../components/Spinner"

export const DashBoardView = () => {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const routinesLoading = useSelector((state: RootState) => state.routines?.loading ?? false)
  const agendaLoading = useSelector((state: RootState) => state.agenda?.loading ?? false)
  const exercisesLoading = useSelector((state: RootState) => state.exercises?.loading ?? false)
  const exercises = useSelector((state: RootState) => state.exercises?.exercises ?? [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        })

        // Cargar rutinas y agenda siempre, ejercicios solo si no están cargados
        const promises = [
          (dispatch as any)(fetchRoutines(token)),
          (dispatch as any)(fetchAgenda(token))
        ]

        // Solo cargar ejercicios si no hay ninguno en el store
        if (exercises.length === 0) {
          promises.push((dispatch as any)(fetchActiveExercises(token)))
        }

        await Promise.all(promises)
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
      }
    }

    loadData()
  }, [dispatch, getAccessTokenSilently, exercises.length])

  const isLoading = routinesLoading || agendaLoading || exercisesLoading

  return (
    <PrivateLayout isDashboard={true}>
      <div className="h-full overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner message="Cargando dashboard..." size="md" />
          </div>
        ) : (
          /* Grid principal del dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            
            {/* Primera fila - Desktop: Próxima sesión y Mis rutinas lado a lado */}
            <div className="col-span-1 h-fit">
              <NextSessionCard />
            </div>

            <div className="col-span-1 h-fit">
              <MyRoutinesCard />
            </div>

            {/* Segunda fila - Ejercicios destacados ocupa todo el ancho */}
            <div className="col-span-1 lg:col-span-2 h-fit">
              <FeaturedExercisesCard />
            </div>
            
          </div>
        )}
      </div>
    </PrivateLayout>
  )
}