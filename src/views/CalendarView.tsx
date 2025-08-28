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
import { createAgendaItem, fetchAgenda, deleteAgendaItem, markAgendaCompleted, updateAgendaItem } from "../store/slices/agendaSlice"
import { fetchRoutines } from "../store/slices/routineSlice"
import type { AgendaRequestDTO } from "../types/agenda/AgendaRequestDTO"
import type { AgendaResponseDTO } from "../types/agenda/AgendaResponseDTO"
import { AgendaDetailsModal } from "../components/calendar/modals/AgendaDetailsModal"
import { EditSessionModal } from "../components/calendar/modals/EditSessionModal"


export const CalendarView = () => {
    const dispatch = useDispatch()
    const agenda = useSelector((state: RootState) => state.agenda)
    const routines = useSelector((state: RootState) => state.routines?.routines ?? [])
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AgendaResponseDTO | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
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
        const userId = 1 // TODO: obtener de auth
        const routineId = Number(sessionData?.routineId ?? 0) || 0
        // Compose ISO from date (yyyy-mm-dd) and time (HH:mm)
        const baseDate = sessionData?.date ?? (selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
        const baseTime = sessionData?.time ?? '09:00'
        const startDateISO = `${baseDate}T${baseTime}:00`
        const payload: AgendaRequestDTO = {
            startDate: startDateISO,
            reminderMinutes: sessionData?.reminderEnabled ? Number(sessionData.reminderTime) : undefined,
            comment: sessionData?.notes || undefined,
            userId,
            routineId,
        }
        try {
            await (dispatch as any)(createAgendaItem(payload))
            setIsModalOpen(false)
            // refresh agenda list
            await (dispatch as any)(fetchAgenda())
        } catch (e) {
            console.error('Error al agendar entrenamiento:', e)
        }
    }

    useEffect(() => {
        ; (dispatch as any)(fetchAgenda())
            ; (dispatch as any)(fetchRoutines())
    }, [dispatch])
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
                                onMarkComplete={async (id) => {
                                    const item = (agenda.items ?? []).find(x => String(x.id) === id)
                                    if (!item || item.completed) return
                                    try {
                                        const result = await (dispatch as any)(markAgendaCompleted(item.id))
                                        if (result && result.payload) {
                                            setSelectedItem(result.payload as AgendaResponseDTO)
                                        }
                                    } catch (e) {
                                        console.error('Error al marcar completada:', e)
                                    }
                                }}
                            />
                        )
                    })()}
                    <NextSessionsCard sessions={nextSessions} onSelect={(id) => {
                        const found = (agenda.items ?? []).find(i => String(i.id) === String(id))
                        if (found) {
                            setSelectedItem(found)
                            setIsDetailsOpen(true)
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
            />

            {/* Details Modal */}
            <AgendaDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                item={selectedItem}
                onDelete={async (id) => {
                    try {
                        await (dispatch as any)(deleteAgendaItem(id))
                        setIsDetailsOpen(false)
                    } catch (e) {
                        console.error('Error al eliminar agenda:', e)
                    }
                }}
                onMarkCompleted={async (id) => {
                    try {
                        const resultAction = await (dispatch as any)(markAgendaCompleted(id))
                        // If fulfilled, update local selected item from payload
                        if (resultAction && resultAction.payload) {
                            setSelectedItem(resultAction.payload as AgendaResponseDTO)
                        }
                    } catch (e) {
                        console.error('Error al marcar completada:', e)
                    }
                }}
                onEdit={(id) => {
                    const found = (agenda.items ?? []).find(i => i.id === id)
                    if (found) {
                        setSelectedItem(found)
                        setIsEditOpen(true)
                    }
                }}
            />

            {/* Edit Modal */}
            {selectedItem && (
                <EditSessionModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    item={selectedItem}
                    routinesOptions={routines.map(r => ({ value: String(r.id), label: r.name }))}
                    onSave={async (changes) => {
                        try {
                            const id = selectedItem.id
                            const resultAction = await (dispatch as any)(updateAgendaItem({ id, changes }))
                            if (resultAction && resultAction.payload) {
                                setSelectedItem(resultAction.payload as AgendaResponseDTO)
                                setIsDetailsOpen(true)
                            }
                        } catch (e) {
                            console.error('Error al actualizar agenda:', e)
                        }
                    }}
                />
            )}

        </PrivateLayout>
    )
}
