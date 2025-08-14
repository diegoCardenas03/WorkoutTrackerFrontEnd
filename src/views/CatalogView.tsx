import { useState } from "react"
import { ExerciseCard } from "../components/catalog/cards/ExerciseCard"
import { CustomSelect } from "../components/CustomSelect"
import { SearchBar } from "../components/SearchBar"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { ExerciseModal } from "../components/catalog/modals/ExerciseModal"
import { handleCategoryChange } from "../utils/handleCategoryChange"


export const CatalogView = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState(null)

    const handleExerciseClick = (exercise: any) => {
        setSelectedExercise(exercise)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedExercise(null)
    }

    const handleAddToRoutine = () => {
        console.log("Añadir a rutina:", selectedExercise);
        // Aquí puedes manejar la lógica para añadir a rutina
    }

    const handleWatchVideo = () => {
        console.log("Ver video de:", selectedExercise);
        // Aquí puedes manejar la lógica para ver video
    }


    const categories = [
        { value: "weight", label: "Peso corporal" },
        { value: "Bar", label: "Barra" },
        { value: "legs", label: "Piernas" },
        { value: "back", label: "Espalda" },
    ];
    const difficulties = [
        { value: "easy", label: "Principiante" },
        { value: "medium", label: "Intermedio" },
        { value: "hard", label: "Avanzado" },

    ];
    const equipment = [
        { value: "tech", label: "Tecnología" },
        { value: "food", label: "Comida" },
        { value: "travel", label: "Viajes" },
        { value: "sports", label: "Deportes" },
    ];

    const exercisePressBanca = {
        title: "Press de banca",
        description: "Ejercicio fundamental para el desarrollo del pecho, deltoides anterior y tríceps.",
        difficulty: { label: "Intermedio", color: "yellow" as const },
        equipment: { label: "Barra", color: "orange" as const },
        targetMuscles: ["Pecho", "Deltoides anterior", "Tríceps"],
        instructions: [
            "Acuéstate en el banco con los pies apoyados en el suelo",
            "Agarra la barra con las manos separadas a la altura de los hombros",
            "Baja la barra hasta tocar el pecho",
            "Empuja la barra hacia arriba hasta extender completamente los brazos"
        ],
        tips: "Mantén la espalda apoyada en el banco y controla el movimiento en todo momento."
    }






    

    return (
        <PrivateLayout>
            <SubHeader nameView="Catálogo de ejercicios" description="Explora todos los ejercicios disponibles" />

            <div className="flex flex-col gap-6">
                <div className="mt-6 p-6 flex flex-col bg-tertiary rounded-lg gap-4 border border-white/20">
                    <SearchBar
                        placeholder="Buscar ejercicios..."
                        onSearch={(value) => console.log("Searching:", value)}
                    />
                    <div className="flex lg:flex-row flex-col w-full gap-4">
                        <CustomSelect
                            name="Todas las categorias"
                            options={categories}
                            defaultValue=""
                            onChange={handleCategoryChange}
                        />
                        <CustomSelect
                            name="Todas las dificultades"
                            options={difficulties}
                            defaultValue=""
                            onChange={handleCategoryChange}
                        />
                        <CustomSelect
                            name="Todo el equipo"
                            options={equipment}
                            defaultValue=""
                            onChange={handleCategoryChange}
                        />
                    </div>
                </div>
                <div className="text-quaternary">
                    6 ejercicios encontrados
                </div>
                <div className="flex flex-col lg:flex-row gap-6 w-full justify-between">
                    <ExerciseCard
                        title="Press de banca"
                        description="Ejercicio fundamental para el desarrollo del pecho, deltoides anterior y tríceps."
                        tags={[
                            { label: "Intermedio", color: "yellow" },
                            { label: "Barra", color: "orange" }
                        ]}
                        onClick={() => handleExerciseClick(exercisePressBanca)}
                    />
                    <ExerciseCard
                        title="Sentadillas"
                        description="Ejercicio básico para fortalecer piernas y glúteos."
                        tags={[
                            { label: "Principiante", color: "green" },
                            { label: "Peso corporal", color: "blue" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                    <ExerciseCard
                        title="Dominadas"
                        description="Ejercicio de peso corporal para fortalecer la espalda y bíceps."
                        tags={[
                            { label: "Avanzado", color: "red" },
                            { label: "Barra", color: "orange" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                </div>
                <div className="flex flex-col lg:flex-row gap-6 w-full justify-between mb-20">
                    <ExerciseCard
                        title="Press de banca"
                        description="Ejercicio fundamental para el desarrollo del pecho, deltoides anterior y tríceps."
                        tags={[
                            { label: "Intermedio", color: "yellow" },
                            { label: "Barra", color: "orange" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                    <ExerciseCard
                        title="Sentadillas"
                        description="Ejercicio básico para fortalecer piernas y glúteos."
                        tags={[
                            { label: "Principiante", color: "green" },
                            { label: "Peso corporal", color: "blue" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                    <ExerciseCard
                        title="Dominadas"
                        description="Ejercicio de peso corporal para fortalecer la espalda y bíceps."
                        tags={[
                            { label: "Avanzado", color: "red" },
                            { label: "Barra", color: "orange" }
                        ]}
                        onClick={() => console.log("Press de banca clicked")}
                    />
                </div>
            </div>
            {/* Modal */}
            {selectedExercise && (
                <ExerciseModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    exercise={selectedExercise}
                    onAddToRoutine={handleAddToRoutine}
                    onWatchVideo={handleWatchVideo}
                />
            )}

        </PrivateLayout>
    )
}
