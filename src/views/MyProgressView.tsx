import { EvolutionCard } from "../components/MyProgress/Cards/EvolutionCard"
import { RegistersCard } from "../components/MyProgress/Cards/RegistersCard"
import { ResumeCard } from "../components/MyProgress/Cards/ResumeCard"
import { TrainsCard } from "../components/MyProgress/Cards/TrainsCard"
import { WeightCard } from "../components/MyProgress/Cards/WeightCard"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchAgenda } from "../store/slices/agendaSlice"
import { fetchAllWeights } from "../store/slices/pesoSlice"
import { useAuth0 } from "@auth0/auth0-react"

export const MyProgressView = () => {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          }
        })
        await (dispatch as any)(fetchAgenda(token))
        await (dispatch as any)(fetchAllWeights(token))
      } catch (e) {
        console.error('Error al cargar datos:', e)
      }
    }
    loadData()
  }, [dispatch, getAccessTokenSilently])

  return (
    <PrivateLayout>
      <SubHeader containOptions={true} />
      <div className="flex flex-col items-center gap-12 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-10">
          <TrainsCard />
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
