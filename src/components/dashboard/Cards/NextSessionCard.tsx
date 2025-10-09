import { LuCalendar, LuTarget } from "react-icons/lu"
import { Button } from "../../Button"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../../store"
import { startRoutineFromDto } from "../../../store/slices/trainingSlice"
import { useMemo } from "react"

export const NextSessionCard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const agendaItems = useSelector((state: RootState) => state.agenda?.items ?? [])
    const routines = useSelector((state: RootState) => state.routines?.routines ?? [])

    // Obtener la próxima sesión pendiente (no completada y fecha más cercana)
    const nextSession = useMemo(() => {
        const now = new Date()
        const pending = agendaItems
            .filter(item => !item.completed && new Date(item.startDate) >= now)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        
        return pending[0] || null
    }, [agendaItems])

    // Obtener los primeros 3 ejercicios de la próxima sesión
    const exercises = useMemo(() => {
        if (!nextSession?.routine) return []
        
        const routine = routines.find(r => r.id === nextSession.routine.id)
        if (!routine?.sessions?.[0]) return []
        
        return routine.sessions[0].sessionExercises?.slice(0, 3).map(se => ({
            name: se.exercise?.name || 'Ejercicio',
            sets: se.sets,
            reps: se.reps
        })) || []
    }, [nextSession, routines])

    const handleStart = () => {
        if (nextSession?.routine) {
            const routine = routines.find(r => r.id === nextSession.routine.id)
            if (routine) {
                (dispatch as any)(startRoutineFromDto({ 
                    routine, 
                    agendaId: nextSession.id  // Pasar el ID de la sesión de agenda
                }))
                navigate('/training')
            }
        } else {
            navigate('/calendar')
        }
    }

    return (
        <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20 h-[17em] md:h-[19em] flex flex-col">
            {/* Header con icono y título */}
            <div className="flex items-center gap-3 mb-4">
                <LuCalendar className=" md:text-[1.1em] mlg:text-[1.2em]" />
                <h3 className="text-[15px] lg:text-[18px]">Próxima sesión</h3>
            </div>

            {nextSession ? (
                <>
                    {/* Nombre del entrenamiento */}
                    <h4 className="text-[15px] lg:text-[18px] mb-4">{nextSession.routine?.name || 'Sin nombre'}</h4>

                    {/* Lista de ejercicios */}
                    <div className="space-y-2 mb-6 flex-1">
                        {exercises.length > 0 ? (
                            exercises.map((ex, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                    <LuTarget />
                                    <span>{ex.name}: {ex.sets}x{ex.reps}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-300">No hay ejercicios configurados</p>
                        )}
                    </div>

                    {/* Botón */}
                    <Button
                        isWidthFull={true}
                        isBlocked={false}
                        isBold={true}
                        mobileHeight="h-11"
                        mdHeight="h-11"
                        lgHeight="h-11"
                        action={handleStart}
                    >
                        Comenzar entrenamiento
                    </Button>
                </>
            ) : (
                <>
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm text-gray-300 text-center">
                            No tienes sesiones programadas.<br/>
                            ¡Agenda tu próximo entrenamiento!
                        </p>
                    </div>
                    <Button
                        isWidthFull={true}
                        isBlocked={false}
                        isBold={true}
                        mobileHeight="h-11"
                        mdHeight="h-11"
                        lgHeight="h-11"
                        action={handleStart}
                    >
                        Ir al calendario
                    </Button>
                </>
            )}
        </div>
    )
}