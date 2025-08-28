import { LuDumbbell } from "react-icons/lu"


interface NextSession {
  id: string
  name: string
  daysAgo: number
}

interface NextSessionsCardProps {
  sessions?: NextSession[]
  onSelect?: (id: string) => void
}

export const NextSessionsCard = ({ sessions = [], onSelect }: NextSessionsCardProps) => {
  
  const formatDays = (days: number) => {
    if (days === 0) return "Hoy"
    if (days === 1) return "En 1 día"
    return `En ${days} días`
  }

  return (
    <div className="bg-tertiary rounded-lg border border-white/10 p-6 w-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-white text-lg font-medium">
          Próximas sesiones
        </h3>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-quaternary text-sm">No hay próximas sesiones programadas</div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-itemsCard rounded-lg p-[10px] border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer group"
              onClick={() => onSelect && onSelect(session.id)}
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
                      {formatDays(session.daysAgo)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}