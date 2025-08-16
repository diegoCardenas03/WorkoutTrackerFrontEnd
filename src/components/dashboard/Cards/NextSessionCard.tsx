import { LuCalendar, LuTarget } from "react-icons/lu"
import { Button } from "../../Button"
import { useNavigate } from "react-router-dom"

export const NextSessionCard = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-tertiary rounded-lg p-6 text-white border border-white/20 h-[17em] md:h-[19em] flex flex-col">
            {/* Header con icono y título */}
            <div className="flex items-center gap-3 mb-4">
                <LuCalendar className=" md:text-[1.1em] mlg:text-[1.2em]" />
                <h3 className="text-[15px] lg:text-[18px]">Próxima sesión</h3>
            </div>

            {/* Nombre del entrenamiento */}
            <h4 className="text-[15px] lg:text-[18px] mb-4">Tren Superior</h4>

            {/* Lista de ejercicios */}
            <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <LuTarget />
                    <span>Peso en banca: 3x8</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <LuTarget />
                    <span>Jalon con barra: 3x10</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <LuTarget />
                    <span>Press militar: 3x8</span>
                </div>
            </div>

            {/* Botón */}
            <Button
                isWidthFull={true}
                isBlocked={false}
                isBold={true}
                mobileHeight="h-11"
                mdHeight="h-11"
                lgHeight="h-11"
                action={() => navigate('/training')}
            >
                Comenzar entrenamiento
            </Button>
        </div>
    )
}