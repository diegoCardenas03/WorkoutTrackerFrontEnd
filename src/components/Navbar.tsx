import { IoCalendarClearOutline, IoGridOutline, IoHomeOutline, IoListCircleOutline, IoStatsChartOutline } from "react-icons/io5"
import { LuUsers } from "react-icons/lu"
import { useNavigate, useLocation } from "react-router-dom"

export const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleNavigation = (path: string) => {
        navigate(path)
    }

    const isActive = (path: string) => {
        return location.pathname === path
    }

    return (
        <div className="bg-navbar flex flex-col h-full w-full align-center text-white font-bold md:border-r md:border-white/20 lg:border-r lg:border-white/20 ">
            <div className="flex align-center justify-center h-0 md:h-auto py-0 md:py-[2em] overflow-hidden">
                <img className="hidden md:block lg:block w-28" src="https://res.cloudinary.com/dno9aqup3/image/upload/v1758733666/Logo_o8y7iv.png" alt="logo" />
            </div>
            <div className="flex flex-col px-2 gap-2 py-5">
                <div
                    onClick={() => handleNavigation('/')}
                    className={`flex items-center justify-center md:justify-start lg:justify-start md:px-7 lg:px-7 h-10 gap-3 rounded-lg cursor-pointer ${isActive('/') ? 'bg-linksNavbar' : 'hover:bg-linksNavbar'
                        }`}
                >
                    <IoHomeOutline className="text-[22px] flex-shrink-0" />
                    <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Inicio</p>
                </div>
                <div
                    onClick={() => handleNavigation('/routines')}
                    className={`flex items-center justify-center md:justify-start lg:justify-start md:px-[26px] lg:px-[26px] h-10 gap-[11px] rounded-lg cursor-pointer ${isActive('/routines') ? 'bg-linksNavbar' : 'hover:bg-linksNavbar'
                        }`}
                >
                    <IoListCircleOutline className="text-[25px] flex-shrink-0" />
                    <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Mis rutinas</p>
                </div>
                <div
                    onClick={() => handleNavigation('/community')}
                    className={`flex items-center justify-center md:justify-start lg:justify-start md:px-[26px] lg:px-[26px] h-10 gap-[11px] rounded-lg cursor-pointer ${isActive('/community') ? 'bg-linksNavbar' : 'hover:bg-linksNavbar'
                        }`}
                >
                    <LuUsers className="text-[22px] flex-shrink-0" />
                    <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Comunidad</p>
                </div>
                <div
                    onClick={() => handleNavigation('/calendar')}
                    className={`flex items-center justify-center md:justify-start lg:justify-start md:px-7 lg:px-7 h-10 gap-3 rounded-lg cursor-pointer ${isActive('/calendar') ? 'bg-linksNavbar' : 'hover:bg-linksNavbar'
                        }`}
                >
                    <IoCalendarClearOutline className="text-[22px] flex-shrink-0" />
                    <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Agenda</p>
                </div>
                <div
                    onClick={() => handleNavigation('/progress')}
                    className={`flex items-center justify-center md:justify-start lg:justify-start md:px-7 lg:px-7 h-10 gap-3 rounded-lg cursor-pointer ${isActive('/progress') ? 'bg-linksNavbar' : 'hover:bg-linksNavbar'
                        }`}
                >
                    <IoStatsChartOutline className="text-[22px] flex-shrink-0" />
                    <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Progreso</p>
                </div>
                <div
                    onClick={() => handleNavigation('/catalog')}
                    className={`flex items-center justify-center md:justify-start lg:justify-start md:px-7 lg:px-7 h-10 gap-3 rounded-lg cursor-pointer ${isActive('/catalog') ? 'bg-linksNavbar' : 'hover:bg-linksNavbar'
                        }`}
                >
                    <IoGridOutline className="text-[22px] flex-shrink-0" />
                    <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Catalogo</p>
                </div>
            </div>
        </div>
    )
}