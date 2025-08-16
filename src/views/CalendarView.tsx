import { LuPlus } from "react-icons/lu"
import { Button } from "../components/Button"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { Calendar } from "../components/calendar/cards/CalendarCard"
import { useState } from "react"
import { TrainProgramed } from "../components/calendar/cards/TrainProgramed"
import { NextSessionsCard } from "../components/calendar/cards/NextSessionsCard"
import { RegisterSessionModal } from "../components/calendar/modals/RegisterSessionModal"


export const CalendarView = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const workoutDates = [
        new Date(2025, 6, 15), // 15 de julio
        new Date(2025, 6, 18), // 18 de julio
        new Date(2025, 6, 22), // 22 de julio
    ]

    const nextSessions = [
        { id: "1", name: "Tren Superior", daysAgo: 12 },
        { id: "2", name: "Piernas & Glúteos", daysAgo: 18 },
        { id: "3", name: "Cardio HIIT", daysAgo: 25 },
        { id: "4", name: "Fuerza Total", daysAgo: 30 }
    ]

    const handleToggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const handleRegisterSession = (sessionData: any) => {
        console.log("Nueva sesión programada:", sessionData);
        // Aquí puedes manejar la lógica para guardar la sesión
    }
    return (
        <PrivateLayout>
            <SubHeader nameView="Agenda" description="Planifica y gestiona tus entrenamientos">
                <Button customWidthMobile="w-[10.7em]" mobileText="text-[11px]" iconPosition={false} icon={<LuPlus />} action={handleToggleModal}>Nuevo entrenamiento</Button>
            </SubHeader>
            <div className="mt-6 flex flex-col lg:flex-row justify-between gap-6">
                <div className="lg:w-[27em] 2xl:w-[50em] ]">
                    <Calendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        highlightedDates={workoutDates}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-4 mb-6 min-w-0">
                    <TrainProgramed />
                    <NextSessionsCard sessions={nextSessions} />
                </div>
            </div>
            {/* Modal */}
            <RegisterSessionModal
                isOpen={isModalOpen}
                onClose={handleToggleModal}
                selectedDate={selectedDate}
                onRegisterSession={handleRegisterSession}
            />

        </PrivateLayout>
    )
}
