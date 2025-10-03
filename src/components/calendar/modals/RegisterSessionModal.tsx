import { useEffect, useState } from "react"

import { Button } from "../../Button"
import { CustomSelect } from "../../CustomSelect"
import { LuBell, LuCalendar, LuX } from "react-icons/lu"

interface RegisterSessionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  onRegisterSession?: (sessionData: SessionData) => Promise<void>
  routinesOptions?: { value: string; label: string }[]
  isLoading?: boolean
}

interface SessionData {
  routineId: string
  date: string
  time: string
  reminderEnabled: boolean
  reminderTime: string
  notes: string
}

export const RegisterSessionModal = ({ 
  isOpen, 
  onClose, 
  selectedDate = new Date(),
  onRegisterSession,
  routinesOptions = [],
  isLoading = false,
}: RegisterSessionModalProps) => {
  const [routineId, setRoutineId] = useState("")
  const [date, setDate] = useState(selectedDate.toISOString().split('T')[0])
  const [time, setTime] = useState(() => {
    const d = selectedDate || new Date()
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  })
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState("30")
  const [notes, setNotes] = useState("")

  const reminderOptions = [
    { value: "15", label: "15 minutos antes" },
    { value: "30", label: "30 minutos antes" },
    { value: "60", label: "1 hora antes" },
    { value: "120", label: "2 horas antes" }
  ]

  const handleRegister = async () => {
    // Validación
    if (!routineId) {
      return
    }
    if (!date || !time) {
      return
    }

    const sessionData: SessionData = {
      routineId,
      date,
      time,
      reminderEnabled,
      reminderTime,
      notes
    }
    
    if (onRegisterSession) {
      await onRegisterSession(sessionData)
      // Reiniciar formulario solo si la operación fue exitosa
      // (el parent cierra el modal y eso triggerá el useEffect de reset)
    }
  }

  // Reinicializar el formulario cuando se abre el modal
  const resetForm = () => {
    setRoutineId("")
    setDate(selectedDate.toISOString().split('T')[0])
    const d = selectedDate || new Date()
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    setTime(`${hh}:${mm}`)
    setReminderEnabled(false)
    setReminderTime("30")
    setNotes("")
  }

  // Reiniciar cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 bg-opacity-75"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-primary rounded-lg w-full max-w-md md:max-w-[650px] mx-auto shadow-2xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LuCalendar className="text-white" size={20} />
              <h2 className="text-white text-lg font-medium">Programar entrenamiento</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <LuX className="md:text-[20px]" />
            </button>
          </div>
          <p className="text-quaternary text-sm mt-2">
            Programa un nuevo entrenamiento seleccionando una rutina
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Seleccionar rutina */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Seleccionar rutina
            </label>
            <CustomSelect
              name="Elige una rutina"
              options={routinesOptions}
              defaultValue={routineId}
              onChange={setRoutineId}
              className="w-full"
            />
          </div>

          {/* Programación */}
          <div>
            <h3 className="text-white text-base font-medium mb-4">Programación</h3>
            
            {/* Fecha */}
            <div className="mb-4">
              <label className="text-quaternary text-sm block mb-2">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 px-4 bg-itemsCard border border-white/5 rounded-lg text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
              />
            </div>

            {/* Hora */}
            <div className="mb-4">
              <label className="text-quaternary text-sm block mb-2">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-12 px-4 bg-itemsCard border border-white/5 rounded-lg text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
              />
            </div>

            {/* Recordatorio */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    reminderEnabled 
                      ? 'bg-white border-white' 
                      : 'border-gray-500 hover:border-gray-400'
                  }`}
                >
                  {reminderEnabled && (
                    <div className="w-2 h-2 bg-black rounded-sm" />
                  )}
                </button>
                <LuBell className="text-quaternary" size={16} />
                <span className="text-quaternary text-sm">Recordatorio</span>
              </div>
              
              {reminderEnabled && (
                <div className="ml-8">
                  <label className="text-quaternary text-sm block mb-2">
                    Tiempo antes del entrenamiento
                  </label>
                  <CustomSelect
                    name="30 minutos antes"
                    options={reminderOptions}
                    defaultValue={reminderTime}
                    onChange={setReminderTime}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="text-quaternary text-sm block mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Objetivos, recordatorios, variaciones..."
              rows={4}
              className="w-full p-4 bg-itemsCard border border-white/5 rounded-lg text-white placeholder-quaternary resize-none focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row  gap-3">
            <Button
              isWhite={true}
              action={handleRegister}
              isWidthFull={true}
              icon={<LuCalendar size={16} />}
              iconPosition={false}
              isBlocked={!routineId || !date || !time || isLoading}
            >
              {isLoading ? 'Programando...' : 'Programar entrenamiento'}
            </Button>

            <Button
              isWhite={false}
              action={onClose}
              isWidthFull={true}
            >
              Cancelar
            </Button>   
          </div>
        </div>
      </div>
    </div>
  )
}