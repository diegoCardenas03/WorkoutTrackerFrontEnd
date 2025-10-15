import { useState, useRef, useEffect } from "react"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"
import { HiCalendarDays } from "react-icons/hi2"

interface CalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date | undefined) => void
  highlightedDates?: Date[]
  className?: string
}

export const Calendar = ({ 
  selectedDate, 
  onDateSelect, 
  highlightedDates = [],
  className = "" 
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef<HTMLDivElement>(null)
  
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  
  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Obtener el primer día del mes y cuántos días tiene
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()
  
  // Generar array de días
  const days = []
  
  // Días vacíos del inicio
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(null)
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setCurrentDate(newDate)
  }
  
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day)
    if (onDateSelect) {
      onDateSelect(clickedDate)
    }
  }
  
  const isToday = (day: number) => {
    // Verificar que estamos en el mes y año actual antes de comparar el día
    const isCurrentMonth = currentMonth === today.getMonth()
    const isCurrentYear = currentYear === today.getFullYear()
    
    return isCurrentMonth && isCurrentYear && today.getDate() === day
  }
  
  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth && 
           selectedDate.getFullYear() === currentYear
  }
  
  // Añade un useEffect para depurar las fechas destacadas
  useEffect(() => {
    if (highlightedDates.length > 0) {
      // Obtener solo las fechas del mes actual
      const relevantDates = highlightedDates.filter(date => 
        date.getMonth() === currentMonth && 
        date.getFullYear() === currentYear
      )
      
      if (relevantDates.length > 0) {
        console.log('🔎 CalendarCard - Fechas destacadas para', monthNames[currentMonth], currentYear, ':')
        console.log('- Total fechas recibidas:', highlightedDates.length)
        console.log('- Fechas relevantes para este mes:', relevantDates.length)
        
        // Agrupar fechas por día para ver qué días se destacarán
        const dayGroups: Record<number, Date[]> = {}
        relevantDates.forEach(date => {
          const day = date.getDate()
          if (!dayGroups[day]) dayGroups[day] = []
          dayGroups[day].push(date)
        })
        
        console.log('- Días que se destacarán:', Object.keys(dayGroups).length)
        console.log('- Días destacados:', Object.keys(dayGroups).join(', '))
      } else {
        console.log('🔎 CalendarCard - No hay fechas destacadas para', monthNames[currentMonth], currentYear)
      }
    }
  }, [highlightedDates, currentMonth, currentYear, monthNames])
  
  const isHighlighted = (day: number) => {
    return highlightedDates.some(date => 
      date.getDate() === day && 
      date.getMonth() === currentMonth && 
      date.getFullYear() === currentYear
    )
  }

 // ...existing code...

  return (
    <div ref={calendarRef} className={`bg-tertiary rounded-lg border border-white/10 w-full h-fit 2xl:h-[50em] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6  border-b border-white/10">
        <div className="flex items-center gap-2">
          <HiCalendarDays className="text-white " size={20} />
          <h3 className="text-white text-base md:text-lg  font-medium">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2  text-quaternary hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <IoChevronBack size={16}  />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2  text-quaternary hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <IoChevronForward size={16}  />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-3 md:p-6 ">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 md:gap-2  mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-quaternary text-xs md:text-sm font-medium text-center py-2 3"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 ">
          {days.map((day, index) => (
            <div
              key={index}
              className="aspect-square flex items-center justify-center"
            >
              {day && (
                <button
                  data-date={day}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDateClick(day)
                  }}
                  className={`
                    w-full h-full rounded-lg text-sm md:text-base  font-medium cursor-pointer
                    ${isSelected(day) 
                      ? 'text-white border border-white' 
                      : isToday(day)
                      ? ' text-black bg-white'
                      : isHighlighted(day)
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'text-quaternary hover:text-white hover:bg-white/5 transition-colors duration-200'
                    }
                  `}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

}