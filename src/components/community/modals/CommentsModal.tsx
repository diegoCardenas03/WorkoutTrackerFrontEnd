import { useState } from "react"
import { LuMessageCircle, LuSend, LuX, LuCornerDownRight, LuHeart, LuTrash2, LuPencil } from "react-icons/lu"
import { Button } from "../../Button"
import { ConfirmModal } from "../../ConfirmModal"


interface Comment {
  id: string
  author: {
    name: string
    initials: string
    avatar?: string
    badge?: string
    auth0UserId?: string
  }
  content: string
  timeAgo: string
  likes: number
  replies?: Comment[]
}

interface CommentsModalProps {
  isOpen: boolean
  onClose: () => void
  exerciseTitle: string
  comments: Comment[]
  currentUserAuth0Id?: string
  onAddComment?: (content: string, replyToId?: number) => void
  onLikeComment?: (commentId: number) => void
  onEditComment?: (commentId: number, content: string) => void
  onDeleteComment?: (commentId: number) => void
}

export const CommentsModal = ({ 
  isOpen, 
  onClose, 
  exerciseTitle,
  comments = [],
  currentUserAuth0Id,
  onAddComment,
  onLikeComment,
  onEditComment,
  onDeleteComment
}: CommentsModalProps) => {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showMenuForComment, setShowMenuForComment] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<{ id: string; content: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  const handleReplySubmit = (commentId: string) => {
    if (replyContent.trim() && onAddComment) {
      onAddComment(replyContent, Number(commentId))
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyContent("")
  }

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditContent(comment.content)
    setShowMenuForComment(null)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditContent("")
  }

  const handleSaveEdit = (commentId: string) => {
    if (editContent.trim() && onEditComment) {
      onEditComment(Number(commentId), editContent)
      setEditingCommentId(null)
      setEditContent("")
    }
  }

  const handleDelete = (commentId: string, commentContent: string) => {
    setCommentToDelete({ id: commentId, content: commentContent })
    setShowDeleteConfirm(true)
    setShowMenuForComment(null)
  }

  const performDelete = async () => {
    if (!commentToDelete || !onDeleteComment) return

    setIsDeleting(true)
    try {
      await onDeleteComment(Number(commentToDelete.id))
      setShowDeleteConfirm(false)
      setCommentToDelete(null)
    } catch (error) {
      console.error("Error al eliminar comentario:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLike = (commentId: string) => {
    if (onLikeComment) {
      onLikeComment(Number(commentId))
    }
  }

  const isOwnComment = (comment: Comment): boolean => {
    return comment.author.auth0UserId === currentUserAuth0Id
  }

  // Función para contar comentarios incluyendo respuestas
  const getTotalCommentsCount = (): number => {
    return comments.reduce((total, comment) => {
      // Contar el comentario principal
      let count = 1
      // Sumar las respuestas si existen
      if (comment.replies && comment.replies.length > 0) {
        count += comment.replies.length
      }
      return total + count
    }, 0)
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
                  Comentarios - {exerciseTitle}
                </h2>
                <p className="text-quaternary text-sm">
                  {getTotalCommentsCount() > 0 
                    ? `${getTotalCommentsCount()} comentario${getTotalCommentsCount() !== 1 ? 's' : ''}`
                    : 'Sé el primero en comentar'}
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
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <LuMessageCircle className="mx-auto text-quaternary mb-3" size={40} />
              <p className="text-quaternary text-sm">
                No hay comentarios aún. ¡Sé el primero en compartir tu experiencia!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
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
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white text-sm font-medium">
                          {comment.author.name}
                        </h4>
                        {comment.author.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            comment.author.badge === 'Creador' 
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                              : 'text-quaternary'
                          }`}>
                            {comment.author.badge === 'Creador' ? '⭐ Creador' : `• ${comment.author.badge}`}
                          </span>
                        )}
                      </div>
                      
                      {/* Menu de opciones para comentarios propios */}
                      {isOwnComment(comment) && (
                        <div className="relative">
                          <button
                            onClick={() => setShowMenuForComment(showMenuForComment === comment.id ? null : comment.id)}
                            className="text-quaternary hover:text-white p-1 transition-colors"
                          >
                            <span className="text-lg">⋮</span>
                          </button>
                          
                          {showMenuForComment === comment.id && (
                            <div className="absolute right-0 top-6 bg-itemsCard border border-white/10 rounded-lg shadow-xl z-10 min-w-[140px] overflow-hidden">
                              <button
                                onClick={() => handleStartEdit(comment)}
                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                              >
                                <LuPencil size={14} />
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(comment.id, comment.content)}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                              >
                                <LuTrash2 size={14} />
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Editar comentario */}
                    {editingCommentId === comment.id ? (
                      <div className="space-y-2 mb-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full p-3 bg-itemsCard border border-white/5 rounded-lg text-white placeholder-quaternary resize-none focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-sm"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 text-quaternary hover:text-white text-sm transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleSaveEdit(comment.id)}
                            disabled={!editContent.trim()}
                            className="px-4 py-1.5 bg-white text-primary rounded-lg text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-quaternary text-sm leading-relaxed mb-2">
                        {comment.content}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-quaternary">{comment.timeAgo}</span>
                      
                      {/* Botón de Like */}
                      <button 
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center gap-1 text-quaternary hover:text-red-400 transition-colors cursor-pointer group"
                      >
                        <LuHeart size={14} className="group-hover:fill-current" />
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                      </button>
                      
                      {/* Botón de Responder */}
                      <button 
                        onClick={() => setReplyingTo(comment.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
                      >
                        Responder
                      </button>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <LuCornerDownRight className="text-quaternary mt-3 flex-shrink-0" size={16} />
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`Responder a ${comment.author.name}...`}
                            rows={2}
                            className="flex-1 p-3 bg-itemsCard border border-white/5 rounded-lg text-white placeholder-quaternary resize-none focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-sm"
                            autoFocus
                          />
                        </div>
                        <div className="flex justify-end gap-2 ml-6">
                          <button
                            onClick={handleCancelReply}
                            className="px-3 py-1.5 text-quaternary hover:text-white text-sm transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleReplySubmit(comment.id)}
                            disabled={!replyContent.trim()}
                            className="px-4 py-1.5 bg-white text-primary rounded-lg text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Responder
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 space-y-3 pl-4 border-l-2 border-white/10">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-8 h-8 bg-iconUser rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-medium">
                                {reply.author.initials}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-white text-sm font-medium">
                                    {reply.author.name}
                                  </h4>
                                  {reply.author.badge && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      reply.author.badge === 'Creador' 
                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                                        : 'text-quaternary'
                                    }`}>
                                      {reply.author.badge === 'Creador' ? '⭐ Creador' : `• ${reply.author.badge}`}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Menu de opciones para respuestas propias */}
                                {isOwnComment(reply) && (
                                  <div className="relative">
                                    <button
                                      onClick={() => setShowMenuForComment(showMenuForComment === reply.id ? null : reply.id)}
                                      className="text-quaternary hover:text-white p-1 transition-colors"
                                    >
                                      <span className="text-lg">⋮</span>
                                    </button>
                                    
                                    {showMenuForComment === reply.id && (
                                      <div className="absolute right-0 top-6 bg-itemsCard border border-white/10 rounded-lg shadow-xl z-10 min-w-[140px] overflow-hidden">
                                        <button
                                          onClick={() => handleStartEdit(reply)}
                                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                        >
                                          <LuPencil size={14} />
                                          Editar
                                        </button>
                                        <button
                                          onClick={() => handleDelete(reply.id, reply.content)}
                                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                        >
                                          <LuTrash2 size={14} />
                                          Eliminar
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {/* Editar respuesta */}
                              {editingCommentId === reply.id ? (
                                <div className="space-y-2 mb-1">
                                  <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={2}
                                    className="w-full p-3 bg-itemsCard border border-white/5 rounded-lg text-white placeholder-quaternary resize-none focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-sm"
                                    autoFocus
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={handleCancelEdit}
                                      className="px-3 py-1.5 text-quaternary hover:text-white text-sm transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      onClick={() => handleSaveEdit(reply.id)}
                                      disabled={!editContent.trim()}
                                      className="px-4 py-1.5 bg-white text-primary rounded-lg text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Guardar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-quaternary text-sm leading-relaxed mb-1">
                                  {reply.content}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-quaternary">{reply.timeAgo}</span>
                                
                                {/* Botón de Like en respuesta */}
                                <button 
                                  onClick={() => handleLike(reply.id)}
                                  className="flex items-center gap-1 text-quaternary hover:text-red-400 transition-colors cursor-pointer group"
                                >
                                  <LuHeart size={12} className="group-hover:fill-current" />
                                  {reply.likes > 0 && <span>{reply.likes}</span>}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-6 pt-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
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

      {/* Confirm Modal para eliminar comentario */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setCommentToDelete(null)
        }}
        onConfirm={performDelete}
        title="Eliminar comentario"
        message={
          commentToDelete 
            ? `¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.\n\n"${commentToDelete.content.substring(0, 100)}${commentToDelete.content.length > 100 ? '...' : ''}"`
            : ''
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}