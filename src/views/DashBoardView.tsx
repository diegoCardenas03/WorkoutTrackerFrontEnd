import { FeaturedExercisesCard } from "../components/dashboard/Cards/FeaturedExercisesCard"
import { MyRoutinesCard } from "../components/dashboard/Cards/MyRoutinesCard"
import { NextSessionCard } from "../components/dashboard/Cards/NextSessionCard"
import { ProgressCard } from "../components/dashboard/Cards/ProgressCard"
import { TipDayCard } from "../components/dashboard/Cards/TipDayCard"
import { PrivateLayout } from "../layouts/PrivateLayout"

export const DashBoardView = () => {
  return (
    <PrivateLayout isDashboard={true}>
      <div className="h-full overflow-auto">
        {/* Grid principal del dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          
          {/* Primera fila - Desktop: Próxima sesión y Progreso lado a lado */}
         
          <div className="col-span-1 h-fit">
            <NextSessionCard />
          </div>
          
          <div className="col-span-1 h-fit">
            <ProgressCard />
          </div>

          {/* Segunda fila - Desktop: Mis rutinas y Ejercicios destacados lado a lado */}
          <div className="col-span-1 h-fit">
            <MyRoutinesCard />
          </div>

          <div className="col-span-1 h-fit">
            <FeaturedExercisesCard />
          </div>

          {/* Tercera fila - Tip del día ocupa todo el ancho disponible */}
          <div className="col-span-1 lg:col-span-2">
            <TipDayCard />
          </div>
        </div>
      </div>
    </PrivateLayout>
  )
}