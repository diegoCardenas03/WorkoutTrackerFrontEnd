import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LuUsers, LuDumbbell, LuUserCog, LuChartNoAxesCombined, LuLogOut } from "react-icons/lu"
import logo from "../../assets/Logo.png"

export const AdminSideBar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: "profile", label: "Mi perfil", icon: LuUserCog, path: "/admin/profile" },
    { id: "employees", label: "Empleados", icon: LuUsers, path: "/admin/employees" },
    { id: "members", label: "Usuarios", icon: LuUsers, path: "/admin/members" },
    { id: "exercises", label: "Ejercicios", icon: LuDumbbell, path: "/admin/exercises" },
    { id: "statistics", label: "Estadísticas", icon: LuChartNoAxesCombined, path: "/admin/stats" }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  const handleLogout = () => {
    // Lógica de logout
    console.log("Cerrar sesión")
    navigate("/landing")
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="bg-navbar flex flex-col h-screen w-64 text-white border-r border-white/20">
      {/* Logo */}
      <div className="flex items-center justify-center py-8 border-b border-white/20">
        <img className="w-32" src={logo} alt="Workout Tracker" />
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                isActiveRoute(item.path)
                  ? 'bg-linksNavbar text-white'
                  : 'text-quaternary hover:text-white hover:bg-linksNavbar'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="border-t border-white/20 p-4">
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-linksNavbar transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">G</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-medium">GERONIMO</p>
              <p className="text-quaternary text-xs">ADMINISTRADOR</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-tertiary border border-white/20 rounded-lg shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-itemsCard transition-colors rounded-lg cursor-pointer"
              >
                <LuLogOut size={16} className="text-quaternary" />
                <span className="text-white text-sm">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}