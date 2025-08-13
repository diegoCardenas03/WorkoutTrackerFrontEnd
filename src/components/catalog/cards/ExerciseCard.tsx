import { LuDumbbell } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"


interface Tag {
  label: string
  color: 'green' | 'blue' | 'yellow' | 'red' | 'orange'
}

interface ExerciseCardProps {
  title: string
  description: string
  tags: Tag[]
  onClick?: () => void
}

export const ExerciseCard = ({ 
  title, 
  description, 
  tags, 
  onClick 
}: ExerciseCardProps) => {
  
  

  return (
    <div 
      className=" bg-tertiary rounded-lg lg:w-[20em] 2xl:w-[25em] py-8 px-6 text-white border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* Header con título e icono */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white text-lg font-medium transition-colors">
          {title}
        </h3>
        <div className="text-quaternary group-hover:text-white transition-colors">
          <LuDumbbell size={20} />
        </div>
      </div>

      {/* Descripción */}
      <p className="text-quaternary text-sm mb-4 leading-relaxed">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getTagStyles(tag.color)} transition-all duration-200`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  )
}