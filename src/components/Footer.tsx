import { useNavigate } from "react-router-dom"

export const Footer = () => {

    const navigate = useNavigate();

    return (
        <footer className="bg-tertiary w-full flex flex-col lg:px-10 md:px-10 px-5 h-[14em] md:h-[11em] lg:h-[11em] pt-8 pb-3 items-center justify-center">
            <div className="w-full pb-4 flex flex-col lg:flex-row md:flex-row items-center justify-between border-b border-white/20 gap-8 lg:gap-0 md:gap-0">
                <img className="lg:w-30 md:w-30 w-25 cursor-pointer" src="https://res.cloudinary.com/dno9aqup3/image/upload/v1758733666/Logo_o8y7iv.png" alt="logo" onClick={() => navigate('/landing')} />

                <ul className="text-quaternary text-[1.2em] font-semibold flex gap-10 ">
                    <li className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/about')}>Sobre Nosotros</li>
                    <li className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/contact')}>Contacto</li>
                </ul>
            </div>

            <p className="text-quaternary pt-8 text-center lg:text-[1em] md:text-[1em] text-[0.8em]">© 2025 Workout Tracker. Plataforma para gimnasios modernos.</p>
        </footer>
    )
}
