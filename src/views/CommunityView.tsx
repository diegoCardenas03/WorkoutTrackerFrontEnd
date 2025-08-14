import { LuBookmark, LuHeart, LuTrendingUp, LuUsers } from "react-icons/lu"
import { FeatureCard } from "../components/FeatureCard"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { SearchBar } from "../components/SearchBar"
import { CustomSelect } from "../components/CustomSelect"
import { handleCategoryChange } from "../utils/handleCategoryChange"
import { CommunityExerciseCard } from "../components/community/cards/CommunityRoutineCard"
import { useState } from "react"
import { CommentsModal } from "../components/community/modals/CommentsModal"


export const CommunityView = () => {

    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false)

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

    const exerciseData = {
        title: "Cardio Danza",
        description: "Diviértete mientras quemas calorías con esta rutina de baile energética",
        author: {
            name: "Sofia Dance",
            title: "Instructora fitness",
            initials: "SD"
        },
        exerciseCount: 8,
        tags: ["Dance", "Fun", "Cardio"],
        difficulty: {
            label: "Principiante",
            color: "green" as const
        },
        rating: 4.8,
        likes: 312,
        saves: 201,
        comments: 61,
        publishDate: "1 de julio"
    }

    const handleOpenComments = () => {
        setIsCommentsModalOpen(true)
    }

    const handleCloseComments = () => {
        setIsCommentsModalOpen(false)
    }

    const handleAddComment = (content: string) => {
        console.log("New comment:", content)
        // Aquí manejarías la lógica para añadir el comentario
    }

    return (
        <PrivateLayout>
            <SubHeader nameView="Rutinas de la Comunidad" description="Descubre, valora y comparte rutinas creadas por otros usuarios" />
            <div className="flex flex-col mt-6 gap-6">
                <div className="flex flex-col xl:flex-row justify-between gap-5 xl:gap-20">
                    <FeatureCard
                        icon={<LuUsers size={20} className="text-[#89B4DB]" />}
                        title="Total rutinas"
                        value="6"
                    />
                    <FeatureCard
                        icon={<LuHeart size={20} className="text-[#FF0000]" />}
                        title="Total likes"
                        value="1308"
                    />
                    <FeatureCard
                        icon={<LuBookmark size={20} className="text-[#04D932]" />}
                        title="Total guardados"
                        value="837"
                    />
                    <FeatureCard
                        icon={<LuTrendingUp size={20} className="text-[#FF8800]" />}
                        title="Categoría popular"
                        value="Cardio"
                    />
                </div>
                <div className="p-6 flex flex-col bg-tertiary rounded-lg gap-4 border border-white/20">
                    <SearchBar
                        placeholder="Buscar rutinas, autores o palabras clave..."
                        onSearch={(value) => console.log("Searching:", value)}
                    />
                    <div className="flex xl:flex-row flex-col w-full gap-4">
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
                            name="Más likes"
                            options={categories}
                            defaultValue=""
                            onChange={handleCategoryChange}
                        />
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row justify-between gap-5">
                    <CommunityExerciseCard
                        {...exerciseData}
                        onLike={() => console.log("Liked!")}
                        onSave={() => console.log("Saved!")}
                        onComments={handleOpenComments}
                        onClick={() => console.log("Card clicked!")}
                    />
                    <CommunityExerciseCard
                        {...exerciseData}
                        onLike={() => console.log("Liked!")}
                        onSave={() => console.log("Saved!")}
                        onComments={handleOpenComments}
                        onClick={() => console.log("Card clicked!")}
                    />
                    <CommunityExerciseCard
                        {...exerciseData}
                        onLike={() => console.log("Liked!")}
                        onSave={() => console.log("Saved!")}
                        onComments={handleOpenComments}
                        onClick={() => console.log("Card clicked!")}
                    />
                </div>
                <div className="flex flex-col xl:flex-row justify-between gap-5 mb-10">
                    <CommunityExerciseCard
                        {...exerciseData}
                        onLike={() => console.log("Liked!")}
                        onSave={() => console.log("Saved!")}
                        onComments={handleOpenComments}
                        onClick={() => console.log("Card clicked!")}
                    />
                    <CommunityExerciseCard
                        {...exerciseData}
                        onLike={() => console.log("Liked!")}
                        onSave={() => console.log("Saved!")}
                        onComments={handleOpenComments}
                        onClick={() => console.log("Card clicked!")}
                    />
                    <CommunityExerciseCard
                        {...exerciseData}
                        onLike={() => console.log("Liked!")}
                        onSave={() => console.log("Saved!")}
                        onComments={handleOpenComments}
                        onClick={() => console.log("Card clicked!")}
                    />
                </div>
            </div>
            <CommentsModal
                isOpen={isCommentsModalOpen}
                onClose={handleCloseComments}
                exerciseTitle={exerciseData.title}
                comments={[]}
                onAddComment={handleAddComment}
            />
        </PrivateLayout>
    )
}
