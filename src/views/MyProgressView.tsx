import { EvolutionCard } from "../components/MyProgress/Cards/EvolutionCard"
import { RegistersCard } from "../components/MyProgress/Cards/RegistersCard"
import { ResumeCard } from "../components/MyProgress/Cards/ResumeCard"
import { TrainsCard } from "../components/MyProgress/Cards/TrainsCard"
import { WeightCard } from "../components/MyProgress/Cards/WeightCard"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"



export const MyProgressView = () => {
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
