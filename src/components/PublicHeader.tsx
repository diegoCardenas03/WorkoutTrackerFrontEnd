import { LuArrowRight, LuMenu, LuX } from "react-icons/lu"
import { Button } from "./Button"
import logo from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\Logo.png"
import { useState } from "react"
import { LoginModal } from "./modals/LoginModal"
import { SignUpModal } from "./modals/SignUpModal"


export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);  

  const openLoginModal = () => {
    setModalType('login');
  }

  const openSignUpModal = () => {
    setModalType('signup');
  }

  const closeModal = () => {
    setModalType(null);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="w-full border-b border-white/20">
      {/* Header Principal */}
      <div className="flex justify-between items-center h-20 px-6">
        <div>
          <img className="w-25" src={logo} alt="logo" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-[5em]">
          <div className="text-quaternary font-medium cursor-pointer hover:text-white transition-colors">Sobre nosotros</div>
          <div className="text-quaternary font-medium cursor-pointer hover:text-white transition-colors">Contacto</div>
          <Button isWhite={false}  action={openLoginModal} >Iniciar Sesion</Button>
          <Button icon={<LuArrowRight />}>Demo Gratis</Button>
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
          <Button isWhite={false} isWidthFull={true}  action={openLoginModal}>Iniciar Sesion</Button>
          <Button isWidthFull={true} icon={<LuArrowRight />}>Demo Gratis</Button>
        </div>
      </div>

       {modalType === 'login' && (
        <LoginModal 
          onClose={closeModal} 
          onSwitchToSignUp={openSignUpModal}  // 
        />
      )}
      
      {modalType === 'signup' && (
        <SignUpModal 
          onClose={closeModal} 
          onSwitchToLogin={openLoginModal}  // 
        />
      )}
    </header>
  )
}
