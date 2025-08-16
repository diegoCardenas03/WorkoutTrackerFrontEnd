import { useState } from "react"
import { LuUsers, LuTrendingUp, LuDollarSign, LuActivity, LuCalendar, LuClock, LuTarget, LuChartNoAxesCombined } from "react-icons/lu"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { SubHeader } from "../../components/SubHeader"

interface StatCard {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  color: string
}

interface ChartData {
  month: string
  members: number
  revenue: number
}

export const StatsAdminView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth')

  const statCards: StatCard[] = [
    {
      title: "Miembros Activos",
      value: "1,247",
      change: "+12.5%",
      changeType: 'positive',
      icon: <LuUsers size={24} />,
      color: "text-blue-400"
    },
    {
      title: "Ingresos Mensuales",
      value: "$45,680",
      change: "+8.2%",
      changeType: 'positive',
      icon: <LuDollarSign size={24} />,
      color: "text-green-400"
    },
    {
      title: "Nuevos Registros",
      value: "89",
      change: "+23.1%",
      changeType: 'positive',
      icon: <LuTrendingUp size={24} />,
      color: "text-purple-400"
    },
    {
      title: "Sesiones Completadas",
      value: "3,421",
      change: "-2.4%",
      changeType: 'negative',
      icon: <LuActivity size={24} />,
      color: "text-orange-400"
    },
    {
      title: "Tasa de Retención",
      value: "94.2%",
      change: "+1.8%",
      changeType: 'positive',
      icon: <LuTarget size={24} />,
      color: "text-cyan-400"
    },
    {
      title: "Promedio Diario",
      value: "156",
      change: "+5.7%",
      changeType: 'positive',
      icon: <LuClock size={24} />,
      color: "text-yellow-400"
    }
  ]

  const chartData: ChartData[] = [
    { month: 'Ene', members: 1100, revenue: 38000 },
    { month: 'Feb', members: 1150, revenue: 39500 },
    { month: 'Mar', members: 1180, revenue: 41200 },
    { month: 'Abr', members: 1220, revenue: 42800 },
    { month: 'May', members: 1200, revenue: 43100 },
    { month: 'Jun', members: 1247, revenue: 45680 }
  ]

  const topGymsData = [
    { name: "Zona Norte", members: 342, utilization: 89 },
    { name: "Centro", members: 298, utilization: 76 },
    { name: "Zona Sur", members: 267, utilization: 82 },
    { name: "Zona Oeste", members: 340, utilization: 94 }
  ]

  const recentActivities = [
    { type: "Nuevo miembro", description: "Carlos García se registró", time: "Hace 2 min", icon: <LuUsers size={16} /> },
    { type: "Sesión completada", description: "Ana López completó Cardio", time: "Hace 5 min", icon: <LuActivity size={16} /> },
    { type: "Pago procesado", description: "Membresía renovada - $120", time: "Hace 12 min", icon: <LuDollarSign size={16} /> },
    { type: "Nuevo entrenamiento", description: "Rutina de Fuerza creada", time: "Hace 18 min", icon: <LuTarget size={16} /> }
  ]

  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      default: return 'text-quaternary'
    }
  }

  return (
    <AdminLayout>
    

      <div className="p-6 space-y-6">
        {/* Filtros de Período */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-white text-sm font-medium">Período:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-tertiary border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
          >
            <option value="thisWeek">Esta Semana</option>
            <option value="thisMonth">Este Mes</option>
            <option value="lastMonth">Mes Anterior</option>
            <option value="thisYear">Este Año</option>
          </select>
        </div>

        {/* Cards de Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-tertiary rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-white/10 ${card.color}`}>
                  {card.icon}
                </div>
                <span className={`text-sm font-medium ${getChangeColor(card.changeType)}`}>
                  {card.change}
                </span>
              </div>
              <h3 className="text-quaternary text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-white text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Gráficos y Tablas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Crecimiento */}
          <div className="bg-tertiary rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <LuChartNoAxesCombined className="text-blue-400" size={24} />
              <h3 className="text-white text-lg font-semibold">Crecimiento de Miembros</h3>
            </div>
            
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-quaternary text-sm w-12">{data.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-primary rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(data.members / 1300) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white text-sm font-medium w-16 text-right">{data.members}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sucursales */}
          <div className="bg-tertiary rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <LuTarget className="text-green-400" size={24} />
              <h3 className="text-white text-lg font-semibold">Rendimiento por Sucursal</h3>
            </div>
            
            <div className="space-y-4">
              {topGymsData.map((gym, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary rounded-lg">
                  <div>
                    <p className="text-white font-medium">{gym.name}</p>
                    <p className="text-quaternary text-sm">{gym.members} miembros</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{gym.utilization}%</p>
                    <p className="text-quaternary text-sm">Utilización</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actividad Reciente y Ingresos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividad Reciente */}
          <div className="lg:col-span-2 bg-tertiary rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <LuActivity className="text-purple-400" size={24} />
              <h3 className="text-white text-lg font-semibold">Actividad Reciente</h3>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-primary rounded-lg">
                  <div className="p-2 bg-white/10 rounded-lg text-quaternary">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{activity.type}</p>
                    <p className="text-quaternary text-xs">{activity.description}</p>
                  </div>
                  <span className="text-quaternary text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de Ingresos */}
          <div className="bg-tertiary rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <LuDollarSign className="text-green-400" size={24} />
              <h3 className="text-white text-lg font-semibold">Ingresos</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-primary rounded-lg">
                <p className="text-quaternary text-sm">Hoy</p>
                <p className="text-white text-xl font-bold">$1,240</p>
                <p className="text-green-400 text-xs">+15.2%</p>
              </div>
              
              <div className="p-4 bg-primary rounded-lg">
                <p className="text-quaternary text-sm">Esta Semana</p>
                <p className="text-white text-xl font-bold">$8,650</p>
                <p className="text-green-400 text-xs">+8.7%</p>
              </div>
              
              <div className="p-4 bg-primary rounded-lg">
                <p className="text-quaternary text-sm">Este Mes</p>
                <p className="text-white text-xl font-bold">$45,680</p>
                <p className="text-green-400 text-xs">+12.3%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}