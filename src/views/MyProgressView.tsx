import { EvolutionCard } from "../components/MyProgress/Cards/EvolutionCard"
import { RegistersCard } from "../components/MyProgress/Cards/RegistersCard"
import { ResumeCard } from "../components/MyProgress/Cards/ResumeCard"
import { TrainsCard } from "../components/MyProgress/Cards/TrainsCard"
import { WeightCard } from "../components/MyProgress/Cards/WeightCard"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { fetchAgenda } from "../store/slices/agendaSlice"
import { fetchAllWeights } from "../store/slices/pesoSlice"
import { useAuth0 } from "@auth0/auth0-react"
import { Spinner } from "../components/Spinner"

export const MyProgressView = () => {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          }
        })
        
        const startTime = Date.now()
        await Promise.all([
          (dispatch as any)(fetchAgenda(token)),
          (dispatch as any)(fetchAllWeights(token))
        ])
        
        // Delay mínimo de 500ms para UX profesional
        const elapsed = Date.now() - startTime
        if (elapsed < 500) {
          await new Promise(resolve => setTimeout(resolve, 500 - elapsed))
        }
      } catch (e) {
        console.error('Error al cargar datos:', e)
      } finally {
        setInitialLoading(false)
      }
    }
    loadData()
  }, [dispatch, getAccessTokenSilently])

  if (initialLoading) {
    return (
      <PrivateLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner message="Cargando progreso..." size="md" />
        </div>
      </PrivateLayout>
    )
  }

  return (
    <PrivateLayout>
      <SubHeader />
      <div className="flex flex-col items-center gap-12 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-10">
          <WeightCard />
        </div>
        <div className="flex flex-col 2xl:flex-row justify-between items-center w-full gap-10">
          <EvolutionCard />
          <RegistersCard />
        </div>

        <div className="w-full pb-10">
          <ResumeCard />
        </div>

      </div>
    </PrivateLayout>
  )
}
