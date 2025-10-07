import { LuHeart, LuBookmark, LuMessageCircle, LuTarget, LuBook } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"
import { Button } from "../../Button"

interface Author {
  name: string
  title: string
  avatar?: string
  initials?: string
}

interface CommunityExerciseCardProps {
  title: string
  description: string
  author: Author
  exerciseCount: number
  tags: string[]
  difficulty: {
    label: string
    color: 'green' | 'blue' | 'yellow' | 'red' | 'orange'
  }
  rating: number
  likes: number
  saves: number
  comments: number
  publishDate: string
  isLiked?: boolean
  isSaved?: boolean
  isOwnRoutine?: boolean
  onLike?: () => void
  onSave?: () => void
  onComments?: () => void
  onClick?: () => void
  className?: string
}

export const CommunityExerciseCard = ({
  title,
  description,
  author,
  exerciseCount,
  tags,
  difficulty,
  rating,
  likes,
  saves,
  comments,
  publishDate,
  isLiked = false,
  isSaved = false,
  isOwnRoutine = false,
  onLike,
  onSave,
  onClick,
  onComments, 
  className = ""
}: CommunityExerciseCardProps) => {

  const handleLike = () => {
    if (onLike) onLike()
  }

  const handleSave = () => {
    if (onSave) onSave()
  }

  const handleComments = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onComments) onComments()
  }


  return (
    <div 
      className={`bg-tertiary rounded-lg border border-white/10 p-4 md:p-6 hover:border-white/20 transition-all duration-200 w-full 2xl:w-[30em] cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white text-lg 2xl:text-xl font-semibold flex items-center gap-2">
            {title}
          </h3>
        </div>
        <p className="text-quaternary text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-iconUser rounded-full flex items-center justify-center">
          {author.avatar ? (
            <img src={author.avatar} alt={author.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-white text-sm 2xl:text-base font-medium">
              {author.initials || author.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        <div>
          <p className="text-white text-sm 2xl:text-base font-medium">{author.name}</p>
          <p className="text-quaternary text-xs 2xl:text-sm">{author.title}</p>
        </div>
      </div>

      {/* Exercise count and difficulty */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LuTarget className="text-quaternary" size={16} />
          <span className="text-white text-sm 2xl:text-base font-medium">{exerciseCount} ejercicios</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs 2xl:text-sm font-medium ${getTagStyles(difficulty.color)}`}>
          {difficulty.label}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 md:px-3 py-1 bg-linksNavbar text-quaternary rounded-full text-xs 2xl:text-sm "
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-quaternary text-sm 2xl:text-base">
          <div className="flex items-center gap-1 cursor-pointer" onClick={handleComments}>
            <LuMessageCircle size={14} className="hover:text-quaternary/80 transition-colors" />
            <span>{comments}</span>
          </div>
        </div>
      </div>

      {/* Publish date */}
      <p className="text-quaternary text-xs 2xl:text-sm mb-4">
        Publicada el {publishDate}
      </p>

      {/* Action buttons */}
      <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
        {isOwnRoutine ? (
          /* Si es rutina propia, mostrar badge de creador */
          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg">
            <LuBook size={16} />
            <span className="text-sm font-medium">Tu rutina publicada</span>
          </div>
        ) : (
          /* Si no es rutina propia, mostrar botones de like y guardar */
          <>
            <Button
              iconPosition={false}
              icon={<LuHeart className={isLiked ? "text-red-500 fill-current" : "text-[#7C0000]"} />}
              isALike={true}
              lgHeight="lg:h-10"
              action={handleLike}
            >
              {likes}
            </Button>
            <Button 
              isWidthFull={true}
              iconPosition={false}
              icon={isSaved ? <LuBookmark className="fill-current" /> : <LuBookmark />}
              lgHeight="lg:h-10"
              action={handleSave}
            >
              {isSaved ? "Guardada" : "Guardar"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}