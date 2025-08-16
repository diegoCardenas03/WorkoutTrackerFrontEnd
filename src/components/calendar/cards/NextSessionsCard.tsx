import { LuDumbbell } from "react-icons/lu"


interface NextSession {
  id: string
  name: string
  daysAgo: number
}

interface NextSessionsCardProps {
  sessions?: NextSession[]
}

export const NextSessionsCard = ({ sessions = [] }: NextSessionsCardProps) => {
  
  const formatDaysAgo = (days: number) => {
    if (days === 0) return "Hoy"
    if (days === 1) return "1 día"
    return `${days} días`
  }

  const defaultSessions: NextSession[] = [
    { id: "1", name: "Tren Superior", daysAgo: 12 },
    { id: "2", name: "Piernas & Glúteos", daysAgo: 18 },
    { id: "3", name: "Cardio HIIT", daysAgo: 25 }
  ]

  const sessionsToShow = sessions.length > 0 ? sessions : defaultSessions

  return (
    <div className="bg-tertiary rounded-lg border border-white/10 p-6 w-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-white text-lg font-medium">
          Próximas sesiones
        </h3>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessionsToShow.map((session) => (
          <div
            key={session.id}
            className="bg-itemsCard rounded-lg p-[10px] border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-quaternary group-hover:text-white transition-colors">
                  <LuDumbbell size={16} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium mb-1">
                    {session.name}
                  </h4>
                  <p className="text-quaternary text-xs">
                    {formatDaysAgo(session.daysAgo)} ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}