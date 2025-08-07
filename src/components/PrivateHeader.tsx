import { LuBell, LuPanelLeft } from "react-icons/lu"
import fotoPerfil from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\FotoPerfil.png"
import { IoCaretDownSharp } from "react-icons/io5"
import { useState } from "react"
import { MenuProfile } from "./MenuProfile"

export const PrivateHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

     const toggleMenu = () => {
        if (!isMenuOpen) {
            setShouldRender(true);
            setTimeout(() => setIsMenuOpen(true), 10);
        } else {
            setIsMenuOpen(false);
            setTimeout(() => setShouldRender(false), 200); // Duración de la animación
        }
    }


    return (
        <header className="flex text-white items-center justify-between h-20 py-3 px-6">
            {/* Icono del navbar, nombre y mensaje de bienvenida */}
            <div className="flex items-center justify-center h-full">
                <div className="flex items-center justify-center md:border-r md:border-white/20 lg:border-r lg:border-white/20 2xl:border-r 2xl:border-white/20 h-full pr-[24px]">
                    <LuPanelLeft className="cursor-pointer hover:text-quaternary transition-colors text-[20px]" />
                </div>
                <div className="flex flex-col md:items-center lg:items-center 2xl:items-center justify-center w-fit md:px-6 lg:px-6 2xl:px-6 gap-2">
                    <h1 className=" text-[12px] md:text-[1.15em] lg:text-[1.15em] 2xl:text-[1.3em] font-extrabold">¡Hola, Geronimo!</h1>
                    <p className="text-quaternary text-[10px] md:text-[13px] lg:text-[13px] 2xl:text-[15px] ">Aquí tu resumen de entrenamiento</p>
                </div>
            </div>

            {/* Notificacion, Foto perfil, Nombre y Icono de apertura */}
            <div className="flex items-center justify-center h-full gap-10">
                <div className="flex items-center justify-center">
                    <LuBell className="cursor-pointer hover:text-quaternary transition-colors text-[20px] md:text-[20px] lg:text-[20px] 2xl:text-[24px]" />
                </div>
                <div className="flex items-center justify-between gap-3 cursor-pointer select-none" onClick={toggleMenu}>
                    <img className="w-[25px] h-[25px] md:w-[1.6em] md:h-[1.6em] lg:w-[1.6em] lg:h-[1.6em] 2xl:w-[1.8em] 2xl:h-[1.8em] cursor-pointer hover:text-quaternary transition-colors" src={fotoPerfil} alt="fotoPerfil" />
                    <p className="font-extrabold hidden md:block lg:block 2xl:block md:text-[11px] lg:text-[11px] 2xl:text-[12px] cursor-pointer hover:text-quaternary transition-colors">GERONIMO</p>
                    <IoCaretDownSharp
                        className={`cursor-pointer hidden md:block lg:block 2xl:block hover:text-quaternary transition-all md:text-[14px] lg:text-[14px] 2xl:text-[15px] ${isMenuOpen && 'rotate-180'}`} />
                </div>
            </div>

            {shouldRender && (
                <div className="absolute top-18 right-4">
                    <MenuProfile isVisible={isMenuOpen} />
                </div>
            )}
        </header>
    )
}
