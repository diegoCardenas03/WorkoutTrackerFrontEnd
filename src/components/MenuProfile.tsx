import { LuLogOut, LuUser } from "react-icons/lu"
import fotoPerfil from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\FotoPerfil.png"

import { FaRegCircleQuestion } from "react-icons/fa6"

interface MenuProfileProps {
    isVisible: boolean;
}

export const MenuProfile = ({ isVisible }: MenuProfileProps) => {
    return (
        <div className={`flex flex-col items-start justify-center gap-2 rounded-lg text-white w-[18em] px-8 py-5 border border-white/20 ${isVisible ? 'menu-appear' : 'menu-disappear'}`}>
            <div className="flex items-center gap-4">
                <img src={fotoPerfil} alt="fotoPerfil" className="w-[2.5em] h-[2.5em]" />
                <p className="font-extrabold text-[12px]">GERONIMO</p>
            </div>
            <hr className="border border-t-white/20 w-full" />
            <div className="flex flex-col  py-2 w-full">

                <div className="flex items-center gap-4 cursor-pointer hover:bg-white/5 rounded-[5px] transition-colors py-2">
                    <div className="w-[2.5em] flex justify-center">
                        <LuUser strokeWidth={3} className="" />

                    </div>
                    <p className="w-[8em] text-[13px]  ">Mi perfil</p>
                </div>


                <div className="flex items-center gap-4 cursor-pointer hover:bg-white/5 rounded-[5px] transition-colors py-2">
                    <div className="w-[2.5em] flex justify-center">
                        <FaRegCircleQuestion   className="" />
                    </div>
                    <p className="w-[8em] text-[13px]  ">Ayuda</p>
                </div>

            </div>

            <hr className="border border-t-white/20 w-full" />

            <div className="flex flex-col  py-2 w-full">

                <div className="flex items-center gap-4 cursor-pointer hover:bg-white/5 rounded-[5px] transition-colors py-2">
                    <div className="w-[2.5em] flex justify-center">
                        <LuLogOut strokeWidth={3} className="" />

                    </div>
                    <p className="w-[8em] text-[13px] ">Cerrar sesión</p>
                </div>

            </div>
        </div>
    )
}
