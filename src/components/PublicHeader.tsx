import { LuArrowRight, LuMenu, LuX } from "react-icons/lu"
import { Button } from "./Button"
import logo from "../assets/Logo.png"
import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"


export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="w-full border-b border-white/20">
      {/* Header Principal */}
      <div className="flex justify-between items-center h-20 px-6">
        <div>
          <img className="w-25 cursor-pointer" src={logo} alt="logo" onClick={() => navigate('/landing')} />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-[5em]">
          <div className="text-quaternary font-medium cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/about')}>Sobre nosotros</div>
          <div className="text-quaternary font-medium cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/contact')}>Contacto</div>
          {isLoading ? (
            <Button isWhite={false} isBlocked={true}>Cargando...</Button>
          ) : isAuthenticated ? (
            <Button isWhite={false} action={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              Cerrar Sesión
            </Button>
          ) : (
            <Button isWhite={false} action={() => loginWithRedirect()}>
              Iniciar Sesión
            </Button>
          )}
          {isAuthenticated ? (
            <Button action={() => navigate('/')} icon={<LuArrowRight />}>Ir al Dashboard</Button>
          ) : (
            <Button action={() => navigate('/')} icon={<LuArrowRight />}>Demo Gratis</Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white text-2xl p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <LuX /> : <LuMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="flex flex-col items-start gap-6 py-6 px-6 bg-primary">
          <div className="text-quaternary font-medium cursor-pointer hover:text-white transition-colors">Sobre nosotros</div>
          <div className="text-quaternary font-medium cursor-pointer hover:text-white transition-colors">Contacto</div>
          {isLoading ? (
            <Button isWhite={false} isWidthFull={true} isBlocked={true}>Cargando...</Button>
          ) : isAuthenticated ? (
            <Button isWhite={false} isWidthFull={true} action={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Cerrar Sesión</Button>
          ) : (
            <Button isWhite={false} isWidthFull={true} action={() => loginWithRedirect()}>Iniciar Sesión</Button>
          )}
          {isAuthenticated ? (
            <Button isWidthFull={true} icon={<LuArrowRight />} action={() => navigate('/')}>Ir al Dashboard</Button>
          ) : (
            <Button isWidthFull={true} icon={<LuArrowRight />}>Demo Gratis</Button>
          )}
        </div>
      </div>

      {/* Eliminados los modales de login y signup, ahora se usa Auth0 Universal Login */}
    </header>
  )
}
