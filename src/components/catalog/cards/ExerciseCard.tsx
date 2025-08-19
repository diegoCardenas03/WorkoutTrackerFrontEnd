import { LuDumbbell, LuCheck } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"
import { Button } from "../../Button"

interface Tag {
  name: string
  color: 'green' | 'blue' | 'yellow' | 'red' | 'orange'
}

interface ExerciseCardProps {
  name: string
  description: string
  tags: Tag[]
  onClick?: () => void
  isSelectMode?: boolean
  isSelected?: boolean
  onConfigureExercise?: () => void
}

export const ExerciseCard = ({
  name,
  description,
  tags,
  onClick,
  isSelectMode = false,
  isSelected = false,
  onConfigureExercise
}: ExerciseCardProps) => {

  const shortDescription = description.length > 100
    ? description.slice(0, 100) + "..."
    : description

  return (
    <div
      className={`bg-tertiary rounded-lg xl:w-[18em] 2xl:w-[23em] py-8 px-6 text-white border transition-all duration-200 cursor-pointer group relative flex flex-col justify-between ${isSelectMode
          ? isSelected
            ? 'border-green-500 bg-green-500/10'
            : 'border-white/10 hover:border-white/20'
          : 'border-white/10 hover:border-white/20'
        }`}
      onClick={onClick}
    >
      {/* Indicador de selección */}
      {isSelectMode && isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <LuCheck size={14} className="text-white" />
        </div>
      )}

      {/* Header con título e icono */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white text-lg font-medium transition-colors">
          {name}
        </h3>
        <div className="text-quaternary group-hover:text-white transition-colors">
          <LuDumbbell size={20} />
        </div>
      </div>

      {/* Descripción */}
      <p className="text-quaternary text-sm mb-4 leading-relaxed">
        {shortDescription}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getTagStyles(tag.color)} transition-all duration-200`}
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Botón de configurar (solo en modo selección) */}
      {isSelectMode && (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            isWhite={false}
            isWidthFull={true}
            action={onConfigureExercise}
          >
            🔧 Configurar y agregar
          </Button>
        </div>
      )}
    </div>
  )
}