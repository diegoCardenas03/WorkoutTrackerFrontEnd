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
    const { workoutDates, dayCounts } = useMemo(() => {
        const highlightedDates: Date[] = []
        // Objeto para contar rutinas por día
        const dayCountMap: Record<string, Set<number>> = {} // clave: YYYY-MM-DD, valor: conjunto de IDs de rutinas
        
        const dayOfWeekMap: Record<string, number> = {
            'SUNDAY': 0,
            'MONDAY': 1,
            'TUESDAY': 2,
            'WEDNESDAY': 3,
            'THURSDAY': 4,
            'FRIDAY': 5,
            'SATURDAY': 6
        }
        
        console.log('🔍 Calculando días a destacar en calendario...')
        
        // SOLUCIÓN: Obtener información completa de rutinas para cada agenda
        // Para cada agenda, buscamos la rutina completa en el store
        const agendaItems = agenda.items ?? []
        
        agendaItems.forEach((agendaItem, index) => {
            console.log(`\n📝 Agenda #${index + 1}: ${agendaItem.id}`)
            console.log(`- Fecha de inicio: ${new Date(agendaItem.startDate).toLocaleDateString()}`)
            
            // Obtener el ID de la rutina desde el item de agenda
            const routineId = agendaItem.routine?.id
            if (!routineId) {
                console.log('❌ No se encontró ID de rutina en este item de agenda')
                return
            }
            
            // Buscar la rutina completa en el store para asegurar que tenemos todos los datos
            const fullRoutine = routines.find(r => r.id === routineId)
            
            if (!fullRoutine) {
                console.log(`❌ No se encontró la rutina ID=${routineId} en el store`)
                // Fallback: usar solo la fecha de la agenda
                const date = new Date(agendaItem.startDate)
                highlightedDates.push(date)
                
                // Registrar la rutina para el contador
                const dateStr = date.toISOString().split('T')[0]
                if (!dayCountMap[dateStr]) dayCountMap[dateStr] = new Set()
                dayCountMap[dateStr].add(routineId)
                
                return
            }
            
            console.log(`✅ Rutina encontrada: ${fullRoutine.name} (ID=${fullRoutine.id})`)
            console.log(`- Sesiones en la rutina: ${fullRoutine.sessions?.length || 0}`)
            
            // Si la rutina tiene sesiones, procesar cada una para destacar sus días
            if (fullRoutine.sessions?.length) {
                // Fecha base para calcular los días
                const startDate = new Date(agendaItem.startDate)
                const startDateDay = startDate.getDay() // Día de la semana (0-6)
                
                console.log(`- Fecha inicio: ${startDate.toLocaleDateString()} (${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][startDateDay]})`)
                
                // Para cada sesión, destacar su día de la semana correspondiente
                fullRoutine.sessions.forEach(session => {
                    // Obtener el día de la semana para esta sesión
                    const dayOfWeek = session.dayOfWeek
                    const sessionDay = dayOfWeekMap[dayOfWeek]
                    
                    if (sessionDay === undefined) {
                        console.log(`❌ Día de semana no reconocido: ${dayOfWeek}`)
                        return
                    }
                    
                    console.log(`- Procesando sesión: ${session.name} (${dayOfWeek}) - día ${sessionDay}`)
                    
                    // Calcular el desplazamiento desde el día de inicio hasta el día de la sesión
                    const daysDiff = (sessionDay - startDateDay + 7) % 7
                    const daysInMs = 24 * 60 * 60 * 1000
                    
                    // Obtener la primera fecha para esta sesión
                    const firstSessionDate = new Date(startDate.getTime() + daysDiff * daysInMs)
                    
                    console.log(`  Primera fecha: ${firstSessionDate.toLocaleDateString()} (${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][firstSessionDate.getDay()]})`)
                    
                    // Generar fechas para 12 semanas (3 meses)
                    for (let week = 0; week < 12; week++) {
                        const sessionDate = new Date(firstSessionDate.getTime() + week * 7 * daysInMs)
                        highlightedDates.push(sessionDate)
                        
                        // Registrar la rutina para el contador
                        const dateStr = sessionDate.toISOString().split('T')[0]
                        if (!dayCountMap[dateStr]) dayCountMap[dateStr] = new Set()
                        dayCountMap[dateStr].add(routineId)
                        
                        if (week < 3) { // Mostrar solo las primeras 3 para no sobrecargar la consola
                            console.log(`  Semana ${week + 1}: ${sessionDate.toLocaleDateString()}`)
                        }
                    }
                })
            } else {
                // Si es una rutina sin sesiones, solo destacar la fecha original
                console.log(`- Rutina simple: destacando solo fecha original`)
                const date = new Date(agendaItem.startDate)
                highlightedDates.push(date)
                
                // Registrar la rutina para el contador
                const dateStr = date.toISOString().split('T')[0]
                if (!dayCountMap[dateStr]) dayCountMap[dateStr] = new Set()
                dayCountMap[dateStr].add(routineId)
            }
        })
        
        // Convertir el mapa de conteo a la estructura necesaria para el calendario
        const dayCounts = Object.entries(dayCountMap).map(([date, routineIds]) => ({
            date,
            count: routineIds.size  // Número de rutinas únicas para ese día
        }))
        
        console.log(`📊 Total de fechas destacadas: ${highlightedDates.length}`)
        console.log(`📊 Días con múltiples rutinas: ${dayCounts.filter(d => d.count > 1).length}`)
        
        return { workoutDates: highlightedDates, dayCounts }
    }, [agenda.items, routines])

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
            
            // La fecha seleccionada en el calendario se envía al backend para
            // que sepa a partir de qué día programar la rutina
            const baseDate = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            
            console.log('📅 Agendando rutina:', routine.name)
            console.log('- ID de rutina:', routineId)
            console.log('- Tipo de rutina:', isWeeklyRoutine ? 'Semanal' : 'Simple')
            console.log('- Fecha seleccionada:', baseDate)
            
            if (isWeeklyRoutine) {
                console.log('- Días de la semana:', routine.sessions.map(s => s.dayOfWeek).join(', '))
                console.log('- Total sesiones:', routine.sessions.length)
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
            
            const payload: AgendaRequestDTO = {
                reminderMinutes: sessionData?.reminderEnabled ? Number(sessionData.reminderTime) : undefined,
                comment: sessionData?.notes || undefined,
                userId: 0,
                routineId,
            }

            const result = await (dispatch as any)(createAgendaItem({ payload, token }))
            
            if (result.type.includes('fulfilled')) {
                const message = isWeeklyRoutine 
                    ? `✅ Rutina semanal programada (${routine.sessions.length} sesiones)` 
                    : '✅ Entrenamiento programado exitosamente'
                    
                setToast({ open: true, type: 'success', message })
                setIsModalOpen(false)
                await (dispatch as any)(fetchAgenda(token))
            } else {
                throw new Error(result.error?.message || 'Error al crear agenda')
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
    
    // Efecto para imprimir las rutinas agendadas en consola
    useEffect(() => {
        if (agenda.items?.length) {
            console.log('📅 Rutinas agendadas:', agenda.items.length, 'encontradas')
            console.log('========================================')
            agenda.items.forEach((item, index) => {
                console.log(`📌 Agenda item #${index + 1}:`)
                console.log(item)
                console.log('- ID:', item.id)
                console.log('- Rutina:', item.routine?.name)
                console.log('- Fecha inicio:', new Date(item.startDate).toLocaleDateString())
                
                // Detalles adicionales sobre la rutina y sus sesiones
                if (item.routine) {
                    console.log('- Datos de la rutina:')
                    console.log('  - ID:', item.routine.id)
                    console.log('  - Nombre:', item.routine.name)
                    console.log('  - Sesiones disponibles:', (item.routine.sessions || []).length)
                    
                    if (item.routine.sessions && item.routine.sessions.length > 0) {
                        console.log('  - Lista de sesiones:')
                        item.routine.sessions.forEach((session, sIndex) => {
                            console.log(`    - Sesión #${sIndex + 1}: ${session.name} (${session.dayOfWeek})`)
                        })
                    } else {
                        console.log('  ⚠️ No hay sesiones en la rutina o no se han cargado correctamente')
                    }
                } else {
                    console.log('⚠️ No hay datos de rutina disponibles')
                }
                
                console.log('----------------------------------------')
            })
            console.log('========================================')
        } else if (!agenda.loading && agenda.items) {
            console.log('📅 No hay rutinas agendadas')
        }
    }, [agenda.items, agenda.loading])
    
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
                        dayCounts={dayCounts}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-4 mb-6 min-w-0">
                    {(() => {
                        const sel = selectedDate ?? new Date()
                        const selectedDayOfWeek = sel.getDay() // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
                        
                        // Mapeo de día de la semana a nombre en inglés (como en el backend)
                        const dayOfWeekMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
                        const selectedDayName = dayOfWeekMap[selectedDayOfWeek]
                        
                        console.log('📅 Día seleccionado:', selectedDayName, `(${selectedDayOfWeek})`)
                        
                        // Filtrar todas las agendas que tengan sesiones para este día de la semana
                        const workouts = (agenda.items ?? []).reduce<Array<{
                            id: string
                            name: string
                            duration: number
                            exercises: number
                            isCompleted: boolean
                            time: string
                        }>>((acc, agendaItem) => {
                            const routine = routines.find(r => r.id === agendaItem.routine?.id)
                            
                            if (!routine) {
                                // Si no encontramos la rutina completa, verificar si la fecha coincide
                                const itemDate = new Date(agendaItem.startDate)
                                if (itemDate.getDay() === selectedDayOfWeek) {
                                    acc.push({
                                        id: String(agendaItem.id),
                                        name: agendaItem.routine?.name ?? 'Rutina',
                                        duration: 0,
                                        exercises: 0,
                                        isCompleted: agendaItem.completed,
                                        time: '00:00',
                                    })
                                }
                                return acc
                            }
                            
                            // Si la rutina tiene sesiones, buscar las que coincidan con el día seleccionado
                            if (routine.sessions && routine.sessions.length > 0) {
                                routine.sessions.forEach(session => {
                                    if (session.dayOfWeek === selectedDayName) {
                                        // Encontramos una sesión para este día de la semana
                                        acc.push({
                                            id: String(agendaItem.id),
                                            name: `${routine.name} - ${session.name}`,
                                            duration: 0,
                                            exercises: session.sessionExercises?.length ?? 0,
                                            isCompleted: agendaItem.completed,
                                            time: '00:00',
                                        })
                                    }
                                })
                            } else {
                                // Rutina sin sesiones: verificar si la fecha de inicio coincide con el día de la semana
                                const itemDate = new Date(agendaItem.startDate)
                                if (itemDate.getDay() === selectedDayOfWeek) {
                                    acc.push({
                                        id: String(agendaItem.id),
                                        name: routine.name,
                                        duration: 0,
                                        exercises: 0,
                                        isCompleted: agendaItem.completed,
                                        time: '00:00',
                                    })
                                }
                            }
                            
                            return acc
                        }, [])
                        
                        console.log('💪 Entrenamientos encontrados para', selectedDayName, ':', workouts.length)
                        
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
                routinesOptions={routines.map(r => {
                    // Verificar si la rutina ya está agendada y no completada
                    const alreadyScheduled = (agenda.items ?? []).some(
                        item => item.routine?.id === r.id && !item.completed
                    );
                    
                    return { 
                        value: String(r.id), 
                        label: r.name,
                        disabled: alreadyScheduled,
                        note: alreadyScheduled ? "Ya agendada" : undefined
                    };
                })}
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
