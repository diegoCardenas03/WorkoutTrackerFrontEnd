import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LuUsers, LuDumbbell, LuUserCog, LuLogOut, LuBicepsFlexed, LuBoxes, LuWrench } from "react-icons/lu"
import logo from "../../assets/Logo.png"
import { useAuth0 } from "@auth0/auth0-react"
import { useUser } from "../../hooks/useUser"

export const AdminSideBar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth0()
  const { userData, auth0User, refetch } = useUser()

  // Escuchar evento de actualización de perfil
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('🔄 [AdminSideBar] Perfil actualizado, recargando datos...')
      refetch()
    }

    window.addEventListener('userProfileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate)
    }
  }, [refetch])

  // Obtener nombre y rol del usuario
  const userName = userData?.name || auth0User?.name || "Usuario"
  const userRole = userData?.role?.name || "ADMINISTRADOR"
  
  // Obtener inicial del nombre
  const userInitial = userName.charAt(0).toUpperCase()


  const menuItems = [
    { id: "profile", label: "Mi perfil", icon: LuUserCog, path: "/admin/profile" },
    { id: "employees", label: "Administradores", icon: LuUsers, path: "/admin/employees" },
    { id: "members", label: "Usuarios", icon: LuUsers, path: "/admin/members" },
    { id: "exercises", label: "Ejercicios", icon: LuDumbbell, path: "/admin/exercises" },
    { id: "muscles", label: "Músculos", icon: LuBicepsFlexed, path: "/admin/muscles" },
    { id: "muscle-zones", label: "Zonas Musculares", icon: LuBoxes, path: "/admin/muscle-zones" },
    { id: "equipment", label: "Equipamiento", icon: LuWrench, path: "/admin/equipment" },
    // { id: "statistics", label: "Estadísticas", icon: LuChartNoAxesCombined, path: "/admin/stats" }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

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
              <span className="text-white font-semibold text-sm">{userInitial}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-medium">{userName.toUpperCase()}</p>
              <p className="text-quaternary text-xs">{userRole.toUpperCase()}</p>
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