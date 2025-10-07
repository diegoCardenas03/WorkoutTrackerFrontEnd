import { IoClose } from "react-icons/io5"
import { LuHeart, LuBookmark, LuMessageCircle, LuCalendarDays, LuBook } from "react-icons/lu"
import { getTagStyles } from "../../../utils/getTagStyles"
import { Button } from "../../Button"
import type { RutinaResponseDTO } from "../../../types/rutina/RutinaResponseDTO"

interface CommunityRoutineModalProps {
  isOpen: boolean
  onClose: () => void
  routine: RutinaResponseDTO | null
  commentsCount?: number
  isLiked?: boolean
  isSaved?: boolean
  isOwnRoutine?: boolean
  onLike?: () => void
  onSave?: () => void
  onComments?: () => void
}

export const CommunityRoutineModal = ({
  isOpen,
  onClose,
  routine,
  commentsCount = 0,
  isLiked = false,
  isSaved = false,
  isOwnRoutine = false,
  onLike,
  onSave,
  onComments
}: CommunityRoutineModalProps) => {
  
  if (!isOpen || !routine) return null

  // Mapear dificultad
  const mapDifficultyToLabel = (difficulty: string): string => {
    const diff = String(difficulty)
    switch (diff) {
      case 'PRINCIPIANTE':
        return 'Principiante'
      case 'INTERMEDIO':
        return 'Intermedio'
      case 'AVANZADO':
        return 'Avanzado'
      default:
        return diff
    }
  }

  const mapDifficultyToColor = (difficulty: string): 'green' | 'yellow' | 'red' => {
    const diff = String(difficulty)
    switch (diff) {
      case 'PRINCIPIANTE':
        return 'green'
      case 'INTERMEDIO':
        return 'yellow'
      case 'AVANZADO':
        return 'red'
      default:
        return 'green'
    }
  }

  // Mapear día de la semana
  const mapDayOfWeekToSpanish: Record<string, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo'
  }

  const isWeekly = (routine.sessions?.length || 0) > 1

  // Obtener músculos objetivo únicos
  const targetMuscles = new Set<string>()
  routine.sessions?.forEach(session => {
    session.sessionExercises?.forEach(se => {
      se.exercise?.targetMuscles?.forEach(m => targetMuscles.add(m.name))
    })
  })

  // Obtener días activos
  const activeDays = routine.sessions?.map(s => 
    mapDayOfWeekToSpanish[String(s.dayOfWeek)] || String(s.dayOfWeek)
  ) || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-primary rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-primary border-b border-white/10 p-6 flex items-start justify-between z-10">
          <div className="flex-1">
            <h2 className="text-white text-2xl font-bold mb-2">{routine.name}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTagStyles(mapDifficultyToColor(routine.difficulty))}`}>
                {mapDifficultyToLabel(routine.difficulty)}
              </span>
              {routine.category && (
                <span className="px-3 py-1 bg-primary rounded-full text-sm font-medium border border-white/20 text-white">
                  {routine.category.name}
                </span>
              )}
              {isWeekly && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                  Rutina Semanal
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Author Info */}
          <div className="bg-tertiary rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-iconUser rounded-full flex items-center justify-center">
                <span className="text-white text-base font-medium">
                  {routine.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{routine.user?.name || "Usuario"}</p>
                <p className="text-quaternary text-sm">
                  {routine.user?.createdRoutines || 0} rutinas creadas • {routine.user?.completedWorkouts || 0} entrenamientos completados
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {routine.description && (
            <div>
              <h3 className="text-white font-semibold mb-2">Descripción</h3>
              <p className="text-quaternary leading-relaxed">{routine.description}</p>
            </div>
          )}

          {/* Target Muscles */}
          {targetMuscles.size > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">Músculos objetivo</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(targetMuscles).map((muscle, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary rounded-full text-sm font-medium border border-white/20 text-white"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Schedule */}
          {isWeekly && activeDays.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">Calendario semanal</h3>
              <div className="flex flex-wrap gap-2">
                {activeDays.map((day, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sessions & Exercises */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              {isWeekly ? "Sesiones de entrenamiento" : "Ejercicios de la rutina"}
            </h3>
            <div className="space-y-4">
              {routine.sessions?.map((session, sessionIndex) => (
                <div key={session.id} className="bg-tertiary rounded-lg border border-white/10 overflow-hidden">
                  {/* Session Header */}
                  {isWeekly && (
                    <div className="bg-itemsCard px-4 py-3 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">
                          {mapDayOfWeekToSpanish[String(session.dayOfWeek)] || session.name || `Sesión ${sessionIndex + 1}`}
                        </h4>
                        <span className="text-quaternary text-sm">
                          {session.sessionExercises?.length || 0} ejercicios
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Exercises List */}
                  <div className="divide-y divide-white/5">
                    {session.sessionExercises?.map((se, index) => (
                      <div key={se.id} className="p-4 hover:bg-itemsCard/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-quaternary text-sm font-medium">
                                #{index + 1}
                              </span>
                              <h5 className="text-white font-medium">
                                {se.exercise?.name || "Ejercicio"}
                              </h5>
                            </div>
                            {se.exercise?.equipment && se.exercise.equipment.length > 0 && (
                              <p className="text-quaternary text-xs mb-2">
                                {se.exercise.equipment.map(e => e.name).join(", ")}
                              </p>
                            )}
                            {se.comment && (
                              <p className="text-quaternary text-sm italic">
                                "{se.comment}"
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 text-sm">
                            <span className="text-white font-medium">
                              {se.sets} series × {se.reps} reps
                            </span>
                            {se.restBetweenSets != null && (
                              <span className="text-quaternary text-xs">
                                Descanso: {se.restBetweenSets}s
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publication Date */}
          <div className="flex items-center gap-2 text-quaternary text-sm">
            <LuCalendarDays size={16} />
            <span>
              Publicada el {new Date(routine.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-primary border-t border-white/10 p-6">
          <div className="flex gap-3">
            {isOwnRoutine ? (
              /* Si es rutina propia, mostrar badge de creador y botón de comentarios */
              <>
                <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg">
                  <LuBook size={16} />
                  <span className="text-sm font-medium">Tu rutina publicada</span>
                </div>
                <Button
                  iconPosition={false}
                  icon={<LuMessageCircle />}
                  action={onComments}
                  lgHeight="lg:h-10"
                >
                  {commentsCount}
                </Button>
              </>
            ) : (
              /* Si no es rutina propia, mostrar botones normales */
              <>
                <Button
                  iconPosition={false}
                  icon={<LuHeart className={isLiked ? "text-red-500 fill-current" : "text-red-400"} />}
                  action={onLike}
                  lgHeight="lg:h-10"
                >
                  {routine?.likesCount || 0}
                </Button>
                <Button
                  iconPosition={false}
                  icon={<LuMessageCircle />}
                  action={onComments}
                  lgHeight="lg:h-10"
                >
                  {commentsCount}
                </Button>
                <Button
                  isWidthFull={true}
                  iconPosition={false}
                  icon={isSaved ? <LuBookmark className="fill-current" /> : <LuBookmark />}
                  action={onSave}
                  lgHeight="lg:h-10"
                >
                  {isSaved ? "Guardada" : "Guardar en Mis Rutinas"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
