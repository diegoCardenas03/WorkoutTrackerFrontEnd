import { LuWeight, LuClock } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"

interface Tag {
    label: string
    color: 'green' | 'blue' | 'yellow' | 'red' | 'orange'
}

interface CurrentExerciseCardProps {
    title: string
    category: string
    tags: Tag[]
    sets: string
    reps: string
    weight: string
    restTime: string
    notes?: string
}

export const CurrentExerciseCard = ({
    title,
    category,
    tags,
    sets,
    reps,
    weight,
    restTime,
    notes
}: CurrentExerciseCardProps) => {
    return (
        <div className="bg-tertiary rounded-lg border border-white/10 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div>
                    <h2 className="text-white text-lg sm:text-xl font-semibold mb-1">
                        {title}
                    </h2>
                    <span className="text-quaternary text-sm bg-itemsCard px-2 py-1 rounded-lg">
                        {category}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-white text-lg sm:text-xl font-medium">
                    <span>{sets}</span>
                    <span className="text-quaternary">x</span>
                    <span>{reps}</span>
                </div>
            </div>


            {/* Video/Image placeholder */}
            <div className="bg-itemsCard rounded-lg h-48 sm:h-64 flex items-center justify-center mb-4 border border-white/10">

                <p className="text-quaternary text-sm">Video demostrativo</p>

            </div>

           

            {/* Notes */}
            {notes && (
                <div className="bg-itemsCard rounded-lg p-3 border border-white/10">
                    <p className="text-quaternary text-sm font-medium mb-1">Notas:</p>
                    <p className="text-white text-sm">{notes}</p>
                </div>
            )}
        </div>
    )
}