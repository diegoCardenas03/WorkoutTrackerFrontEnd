import { useState } from "react"
import { LuMessageCircle, LuSend, LuX } from "react-icons/lu"
import { Button } from "../../Button"


interface Comment {
  id: string
  author: {
    name: string
    initials: string
    avatar?: string
    badge?: string
  }
  content: string
  timeAgo: string
}

interface CommentsModalProps {
  isOpen: boolean
  onClose: () => void
  exerciseTitle: string
  comments: Comment[]
  onAddComment?: (content: string) => void
}

export const CommentsModal = ({ 
  isOpen, 
  onClose, 
  exerciseTitle,
  comments = [],
  onAddComment
}: CommentsModalProps) => {
  const [newComment, setNewComment] = useState("")

  const defaultComments: Comment[] = [
    {
      id: "1",
      author: {
        name: "Flor Gimenez",
        initials: "FG",
        badge: "Miembro de la comunidad"
      },
      content: "Me encanta! Es súper divertido y no se siente como ejercicio. La música que recomiendas es perfecta.",
      timeAgo: "Hace 1 día"
    },
    {
      id: "2", 
      author: {
        name: "Bucha",
        initials: "BC",
        badge: "Miembro de la comunidad"
      },
      content: "¿Esto es real? ¿Es la mejor rutina que he hecho lejos! Totalmente recomendada.",
      timeAgo: "Hace 5 días"
    },
   
  ]

  const commentsToShow = comments.length > 0 ? comments : defaultComments

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      if (onAddComment) {
        onAddComment(newComment)
      }
      setNewComment("")
    }
  }

  const handleReply = (commentId: string) => {
    console.log("Reply to comment:", commentId)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 bg-opacity-75"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-primary rounded-lg w-full max-w-lg mx-auto shadow-2xl max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LuMessageCircle className="text-white" size={20} />
              <div>
                <h2 className="text-white text-lg font-medium">
                  Comentarios - {exerciseTitle} <span className="text-lg">💃</span>
                </h2>
                <p className="text-quaternary text-sm">
                  Comparte tu experiencia y pregunta dudas sobre esta rutina
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LuX size={20} />
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {commentsToShow.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {comment.content ? (
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-iconUser rounded-full flex items-center justify-center flex-shrink-0">
                    {comment.author.avatar ? (
                      <img 
                        src={comment.author.avatar} 
                        alt={comment.author.name} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {comment.author.initials}
                      </span>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white text-sm font-medium">
                        {comment.author.name}
                      </h4>
                      {comment.author.badge && (
                        <span className="text-quaternary text-xs">
                          {comment.author.badge}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-quaternary text-sm leading-relaxed mb-2">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-quaternary">{comment.timeAgo}</span>
                      <button 
                        onClick={() => handleReply(comment.id)}
                        className="text-quaternary hover:text-white transition-colors cursor-pointer"
                      >
                        🔄 Responder
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Comment input area for the last user
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-iconUser rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {comment.author.initials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white text-sm font-medium">
                        {comment.author.name}
                      </h4>
                      <span className="text-quaternary text-xs">
                        {comment.author.badge}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="p-6 pt-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Comenta tu experiencia o alguna pregunta que tengas"
              rows={3}
              className="w-full p-4 bg-itemsCard border border-white/5 rounded-lg text-white placeholder-quaternary resize-none focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-sm"
            />
            
            <div className="flex justify-end">
              <Button
              iconPosition={false}
              icon={<LuSend/>}
              >
                Publicar comentario
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}