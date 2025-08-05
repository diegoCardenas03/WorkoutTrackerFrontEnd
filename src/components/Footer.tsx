import logo from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\Logo.png"

export const Footer = () => {

    return (
        <footer className="bg-tertiary w-full flex flex-col lg:px-10 md:px-10 px-5 h-[14em] md:h-[11em] lg:h-[11em] pt-8 pb-3 items-center justify-center">
            <div className="w-full pb-4 flex flex-col lg:flex-row md:flex-row items-center justify-between border-b border-white/20 gap-8 lg:gap-0 md:gap-0">
                <img className="lg:w-30 md:w-30 w-25" src={logo} alt="logo" />

                <ul className="text-quaternary text-[1.2em] font-semibold flex gap-10 ">
                    <li className="cursor-pointer hover:text-white transition-colors">Sobre Nosotros</li>
                    <li className="cursor-pointer hover:text-white transition-colors">Contacto</li>
                </ul>
            </div>

            <p className="text-quaternary pt-8 text-center lg:text-[1em] md:text-[1em] text-[0.8em]">© 2025 Workout Tracker. Plataforma para gimnasios modernos.</p>
        </footer>
    )
}
