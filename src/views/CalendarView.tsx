import { LuPlus } from "react-icons/lu"
import { Button } from "../components/Button"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { Calendar } from "../components/calendar/cards/CalendarCard"
import { useEffect, useMemo, useState } from "react"
import { TrainProgramed } from "../components/calendar/cards/TrainProgramed"
import { NextSessionsCard } from "../components/calendar/cards/NextSessionsCard"
import { RegisterSessionModal } from "../components/calendar/modals/RegisterSessionModal"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store"
import { createAgendaItem, fetchAgenda, deleteAgendaItem, updateAgendaItem } from "../store/slices/agendaSlice"
import { fetchRoutines } from "../store/slices/routineSlice"
import type { AgendaRequestDTO } from "../types/agenda/AgendaRequestDTO"
import type { AgendaResponseDTO } from "../types/agenda/AgendaResponseDTO"
import { AgendaDetailsModal } from "../components/calendar/modals/AgendaDetailsModal"
import { EditSessionModal } from "../components/calendar/modals/EditSessionModal"
import { Toast } from "../components/Toast"
import { useAuth0 } from "@auth0/auth0-react"
import { Spinner } from "../components/Spinner"
import { startRoutineFromDto } from "../store/slices/trainingSlice"
import { useNavigate } from "react-router-dom"

export const CalendarView = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { getAccessTokenSilently } = useAuth0()
    const agenda = useSelector((state: RootState) => state.agenda)
    const routines = useSelector((state: RootState) => state.routines?.routines ?? [])
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AgendaResponseDTO | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [toast, setToast] = useState({ open: false, type: 'success' as 'success' | 'error', message: '' })
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const workoutDates = useMemo(() => {
        return (agenda.items ?? []).map(i => new Date(i.startDate))
    }, [agenda.items])

    const nextSessions = useMemo(() => {
        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const dayMs = 1000 * 60 * 60 * 24
        const upcoming = (agenda.items ?? [])
            .filter(i => !i.completed)
            .filter(i => new Date(i.startDate) >= todayStart)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 5)
        return upcoming.map(i => {
            const start = new Date(i.startDate)
            const targetStart = new Date(start.getFullYear(), start.getMonth(), start.getDate())
            const sameDay = targetStart.getTime() === todayStart.getTime()
            const days = sameDay ? 0 : Math.max(1, Math.round((targetStart.getTime() - todayStart.getTime()) / dayMs))
            return { id: String(i.id), name: i.routine?.name ?? 'Rutina', daysAgo: days }
        })
    }, [agenda.items])

    const handleToggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const handleRegisterSession = async (sessionData: any) => {
        setIsCreating(true)
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                }
            })

            const routineId = Number(sessionData?.routineId ?? 0) || 0
            
            // Buscar la rutina para determinar su tipo
            const routine = routines.find(r => r.id === routineId)
            if (!routine) {
                throw new Error('Rutina no encontrada')
            }

            const isWeeklyRoutine = routine.sessions.length > 1
            
            const baseDate = sessionData?.date ?? (selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
            const baseTime = sessionData?.time ?? '09:00'
            
            // Mapa de días de la semana
            const dayOfWeekMap: Record<string, number> = {
                'SUNDAY': 0,
                'MONDAY': 1,
                'TUESDAY': 2,
                'WEDNESDAY': 3,
                'THURSDAY': 4,
                'FRIDAY': 5,
                'SATURDAY': 6
            }
            
            // Obtener el día de la semana de la fecha seleccionada
            // Usar el constructor con año, mes, día para evitar problemas de zona horaria
            const [year, month, day] = baseDate.split('-').map(Number)
            const selectedDateObj = new Date(year, month - 1, day) // month es 0-indexed
            const selectedDayOfWeek = selectedDateObj.getDay()
            
            // VALIDACIÓN 1: No permitir fechas pasadas
            const today = new Date()
            const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const selectedDateOnly = new Date(year, month - 1, day)
            
            if (selectedDateOnly < todayOnly) {
                setToast({ 
                    open: true, 
                    type: 'error', 
                    message: '⚠️ No puedes agendar rutinas en fechas pasadas' 
                })
                return
            }
            
            // Obtener los días que tiene configurados la rutina
            const routineDays = routine.sessions.map(s => dayOfWeekMap[s.dayOfWeek])
            
            // Ordenar los días para encontrar el primero de la semana
            const sortedRoutineDays = [...routineDays].sort((a, b) => a - b)
            const firstDayOfRoutine = sortedRoutineDays[0]
            
            // console.log('🔍 Debug agendamiento:')
            // console.log('- Fecha seleccionada (string):', baseDate)
            // console.log('- Fecha como objeto:', selectedDateObj)
            // console.log('- Día de la semana (número):', selectedDayOfWeek)
            // console.log('- Día de la semana (nombre):', ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][selectedDayOfWeek])
            // console.log('- Días de la rutina:', routine.sessions.map(s => s.dayOfWeek))
            // console.log('- Días de la rutina (números):', routineDays)
            // console.log('- Es rutina semanal:', isWeeklyRoutine)
            // console.log('- Primer día de la rutina:', firstDayOfRoutine)
            
            // VALIDACIÓN 2: Para rutinas semanales, solo el primer día
            if (isWeeklyRoutine) {
                if (selectedDayOfWeek !== firstDayOfRoutine) {
                    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
                    const firstDayName = dayNames[firstDayOfRoutine]
                    
                    setToast({ 
                        open: true, 
                        type: 'error', 
                        message: `⚠️ Las rutinas semanales deben agendarse desde el primer día. Esta rutina inicia el ${firstDayName}` 
                    })
                    return
                }
            } else {
                // VALIDACIÓN 3: Para rutinas simples, verificar el día correcto
                if (!routineDays.includes(selectedDayOfWeek)) {
                    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
                    const availableDays = routineDays.map(d => dayNames[d]).join(', ')
                    
                    setToast({ 
                        open: true, 
                        type: 'error', 
                        message: `⚠️ Esta rutina solo está disponible para: ${availableDays}` 
                    })
                    return
                }
            }
            
            // Verificar si ya está agendada y no completada
            // No permitir duplicados hasta que se complete la rutina actual
            const hasIncompleteRoutine = (agenda.items ?? []).some(item => {
                return item.routine?.id === routineId && !item.completed
            })
            
            if (hasIncompleteRoutine) {
                setToast({ 
                    open: true, 
                    type: 'error', 
                    message: `⚠️ Ya tienes esta rutina agendada y pendiente. Complétala antes de volver a agendarla.` 
                })
                return
            }
            
            if (isWeeklyRoutine) {
                // Rutina semanal: crear un item de agenda por cada sesión en su día correspondiente
                // Usar la fecha seleccionada para calcular la semana correcta
                const currentWeekStart = new Date(year, month - 1, day)
                currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()) // Domingo de esa semana
                
                // console.log('📅 Calculando fechas para rutina semanal:')
                // console.log('- Fecha seleccionada:', baseDate)
                // console.log('- Domingo de esa semana:', currentWeekStart.toISOString().split('T')[0])
                
                const agendaPromises = routine.sessions.map(session => {
                    const dayIndex = dayOfWeekMap[session.dayOfWeek]
                    // Crear fecha correctamente usando año, mes, día
                    const sessionYear = currentWeekStart.getFullYear()
                    const sessionMonth = currentWeekStart.getMonth()
                    const sessionDay = currentWeekStart.getDate() + dayIndex
                    const sessionDate = new Date(sessionYear, sessionMonth, sessionDay)
                    
                    const sessionDateISO = sessionDate.toISOString().split('T')[0]
                    const startDateISO = `${sessionDateISO}T${baseTime}:00`
                    
                    // console.log(`  - Sesión ${session.dayOfWeek} (${dayIndex}): ${sessionDateISO}`)
                    
                    const payload: AgendaRequestDTO = {
                        startDate: startDateISO,
                        reminderMinutes: sessionData?.reminderEnabled ? Number(sessionData.reminderTime) : undefined,
                        comment: sessionData?.notes || undefined,
                        userId: 0,
                        routineId,
                    }
                    
                    return (dispatch as any)(createAgendaItem({ payload, token }))
                })
                
                const results = await Promise.all(agendaPromises)
                const allSuccessful = results.every(r => r.type.includes('fulfilled'))
                
                if (allSuccessful) {
                    setToast({ open: true, type: 'success', message: `✅ Rutina semanal programada (${routine.sessions.length} sesiones)` })
                    setIsModalOpen(false)
                    await (dispatch as any)(fetchAgenda(token))
                } else {
                    throw new Error('Error al crear algunas sesiones')
                }
            } else {
                // Rutina simple: crear un solo item de agenda
                const startDateISO = `${baseDate}T${baseTime}:00`
                
                const payload: AgendaRequestDTO = {
                    startDate: startDateISO,
                    reminderMinutes: sessionData?.reminderEnabled ? Number(sessionData.reminderTime) : undefined,
                    comment: sessionData?.notes || undefined,
                    userId: 0,
                    routineId,
                }

                const result = await (dispatch as any)(createAgendaItem({ payload, token }))
                
                if (result.type.includes('fulfilled')) {
                    setToast({ open: true, type: 'success', message: '✅ Entrenamiento programado exitosamente' })
                    setIsModalOpen(false)
                    await (dispatch as any)(fetchAgenda(token))
                } else {
                    throw new Error(result.error?.message || 'Error al crear agenda')
                }
            }
        } catch (e: any) {
            console.error('Error al agendar entrenamiento:', e)
            setToast({ open: true, type: 'error', message: `❌ ${e.message || 'Error al programar entrenamiento'}` })
        } finally {
            setIsCreating(false)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    }
                })
                
                const startTime = Date.now()
                await Promise.all([
                    (dispatch as any)(fetchAgenda(token)),
                    (dispatch as any)(fetchRoutines(token))
                ])
                
                // Delay mínimo de 500ms para UX profesional
                const elapsed = Date.now() - startTime
                if (elapsed < 500) {
                    await new Promise(resolve => setTimeout(resolve, 500 - elapsed))
                }
            } catch (e) {
                console.error('Error al cargar datos:', e)
                setToast({ open: true, type: 'error', message: '❌ Error al cargar agenda' })
            } finally {
                setInitialLoading(false)
            }
        }
        loadData()
    }, [dispatch, getAccessTokenSilently])
    
    if (initialLoading) {
        return (
            <PrivateLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Spinner message="Cargando agenda..." size="md" />
                </div>
            </PrivateLayout>
        )
    }
    
    return (
        <PrivateLayout>
            <SubHeader nameView="Agenda" description="Planifica y gestiona tus entrenamientos">
                <Button customWidthMobile="w-[10.7em]" mobileText="text-[11px]" iconPosition={false} icon={<LuPlus />} action={handleToggleModal}>Nuevo entrenamiento</Button>
            </SubHeader>
            <div className="mt-6 flex flex-col lg:flex-row justify-between gap-6">
                <div className="lg:w-[27em] 2xl:w-[50em] ]">
                    <Calendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        highlightedDates={workoutDates}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-4 mb-6 min-w-0">
                    {(() => {
                        const sel = selectedDate ?? new Date()
                        const dayStart = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate())
                        const dayEnd = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() + 1)
                        const workouts = (agenda.items ?? [])
                            .filter(i => {
                                const d = new Date(i.startDate)
                                return d >= dayStart && d < dayEnd
                            })
                            .map(i => {
                                const d = new Date(i.startDate)
                                const hh = String(d.getHours()).padStart(2, '0')
                                const mm = String(d.getMinutes()).padStart(2, '0')
                                return {
                                    id: String(i.id),
                                    name: i.routine?.name ?? 'Rutina',
                                    duration: 0,
                                    exercises: 0,
                                    isCompleted: i.completed,
                                    time: `${hh}:${mm}`,
                                }
                            })
                        return (
                            <TrainProgramed
                                selectedDate={selectedDate}
                                workouts={workouts}
                                onSelect={(id) => {
                                    const found = (agenda.items ?? []).find(i => String(i.id) === id)
                                    if (found) {
                                        setSelectedItem(found)
                                        setIsDetailsOpen(true)
                                    }
                                }}
                            />
                        )
                    })()}
                    <NextSessionsCard sessions={nextSessions} onSelect={(id) => {
                        const found = (agenda.items ?? []).find(i => String(i.id) === String(id))
                        if (found) {
                            // Primero actualizar la fecha seleccionada
                            const sessionDate = new Date(found.startDate)
                            setSelectedDate(sessionDate)
                            
                            // Usar setTimeout para asegurar que el modal se abra después del re-render
                            setTimeout(() => {
                                setSelectedItem(found)
                                setIsDetailsOpen(true)
                            }, 0)
                        }
                    }} />
                </div>
            </div>
            {/* Modal */}
            <RegisterSessionModal
                isOpen={isModalOpen}
                onClose={handleToggleModal}
                selectedDate={selectedDate}
                onRegisterSession={handleRegisterSession}
                routinesOptions={routines.map(r => ({ value: String(r.id), label: r.name }))}
                isLoading={isCreating}
            />

            {/* Toast */}
            <Toast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />

            {/* Details Modal */}
            <AgendaDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                item={selectedItem}
                onDelete={async (id) => {
                    try {
                        const token = await getAccessTokenSilently({
                            authorizationParams: {
                                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                            }
                        })
                        const result = await (dispatch as any)(deleteAgendaItem({ id, token }))
                        if (result.type.includes('fulfilled')) {
                            setToast({ open: true, type: 'success', message: '✅ Sesión eliminada' })
                            setIsDetailsOpen(false)
                        } else {
                            throw new Error('Error al eliminar')
                        }
                    } catch (e) {
                        console.error('Error al eliminar agenda:', e)
                        setToast({ open: true, type: 'error', message: '❌ Error al eliminar sesión' })
                    }
                }}
                onEdit={(id) => {
                    const found = (agenda.items ?? []).find(i => i.id === id)
                    if (found) {
                        setSelectedItem(found)
                        setIsDetailsOpen(false) // Cerrar modal de detalles
                        setIsEditOpen(true)
                    }
                }}
                onStartTraining={(agendaItem) => {
                    if (agendaItem.routine) {
                        const routine = routines.find(r => r.id === agendaItem.routine.id)
                        if (routine) {
                            (dispatch as any)(startRoutineFromDto({ 
                                routine, 
                                agendaId: agendaItem.id 
                            }))
                            navigate('/training')
                        } else {
                            setToast({ open: true, type: 'error', message: '❌ No se encontró la rutina' })
                        }
                    }
                }}
            />

            {/* Edit Modal */}
            {selectedItem && (
                <EditSessionModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    item={selectedItem}
                    isLoading={isUpdating}
                    onSave={async (changes) => {
                        setIsUpdating(true)
                        try {
                            const token = await getAccessTokenSilently({
                                authorizationParams: {
                                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                                }
                            })
                            const id = selectedItem.id
                            const resultAction = await (dispatch as any)(updateAgendaItem({ id, changes, token }))
                            if (resultAction && resultAction.payload) {
                                setSelectedItem(resultAction.payload as AgendaResponseDTO)
                                setToast({ open: true, type: 'success', message: '✅ Sesión actualizada' })
                                setIsEditOpen(false)
                                setIsDetailsOpen(true)
                            }
                        } catch (e) {
                            console.error('Error al actualizar agenda:', e)
                            setToast({ open: true, type: 'error', message: '❌ Error al actualizar sesión' })
                        } finally {
                            setIsUpdating(false)
                        }
                    }}
                />
            )}

        </PrivateLayout>
    )
}
