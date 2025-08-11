import logo from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\Logo.png"
import { IoCalendarClearOutline, IoGridOutline, IoHomeOutline, IoListCircleOutline, IoStatsChartOutline } from "react-icons/io5"


export const Navbar = () => {
  return (
    <div className="bg-navbar flex flex-col h-screen w-[4em] md:w-[13em] lg:w-[15em] 2xl:w-[17em] align-center text-white font-bold md:border-r md:border-white/20 lg:border-r lg:border-white/20">
        <div className="flex align-center justify-center h-0 md:h-auto py-0 md:py-[2em] overflow-hidden">
          <img className="hidden md:block lg:block w-28" src={logo} alt="logo" />
        </div>
        <div className="flex flex-col px-2 gap-2 py-5">
            <div className="flex items-center justify-center md:justify-start lg:justify-start md:px-7  lg:px-7 h-10 gap-3 rounded-lg hover:bg-linksNavbar cursor-pointer">
                <IoHomeOutline className="text-[22px] flex-shrink-0"/>
                <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Inicio</p>
            </div>
            <div className="flex items-center justify-center md:justify-start lg:justify-start md:px-[26px]  lg:px-[26px] h-10 gap-[11px] rounded-lg hover:bg-linksNavbar cursor-pointer">
                <IoListCircleOutline className="text-[25px]"/>
                <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Mis rutinas</p>
            </div>
            <div className="flex items-center justify-center md:justify-start lg:justify-start md:px-7  lg:px-7 h-10 gap-3 rounded-lg hover:bg-linksNavbar cursor-pointer">
                <IoCalendarClearOutline className="text-[22px] flex-shrink-0"/>
                <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Agenda</p>
            </div>
            <div className="flex items-center justify-center md:justify-start lg:justify-start md:px-7  lg:px-7 h-10 gap-3 rounded-lg hover:bg-linksNavbar cursor-pointer">
                <IoStatsChartOutline className="text-[22px] flex-shrink-0"/>
                <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Progreso</p>
            </div>
            <div className="flex items-center justify-center md:justify-start lg:justify-start md:px-7  lg:px-7 h-10 gap-3 rounded-lg hover:bg-linksNavbar cursor-pointer">
                <IoGridOutline className="text-[22px] flex-shrink-0"/>
                <p className="hidden md:block lg:block md:text-[14px] lg:text-[15px] 2xl:text-[16px] whitespace-nowrap">Catalogo</p>
            </div>
            
        </div>
    </div>
  )
}
