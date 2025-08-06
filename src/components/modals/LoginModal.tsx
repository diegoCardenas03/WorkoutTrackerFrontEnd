import { Button } from "../Button"
import { FcGoogle } from "react-icons/fc"
import { LuX } from "react-icons/lu"

interface LoginModalProps {
    onClose?: () => void
    onSwitchToSignUp?: () => void 
}

export const LoginModal = ({ onClose, onSwitchToSignUp }: LoginModalProps) => {
    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"  onClick={onClose} >
            <div className="relative bg-primary rounded-lg border border-white/10 p-8 w-[550px] max-w-[90vw] h-fit"  onClick={(e) => e.stopPropagation()}>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    <LuX size={20} />
                </button>

                <h2 className="text-white text-[1.5em] md:text-[2em] lg:text-[2em] font-bold text-center mb-6">
                    Iniciar Sesión
                </h2>


                <form className="flex flex-col gap-4">




                    <div>
                        <label className="block text-white text-[12px] md:text-sm lg:text-sm mb-2">
                            Correo
                        </label>
                        <input
                            type="email"
                            placeholder="Ingrese su email"
                            className="w-full h-10 md:h-10 lg:h-10 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-lg text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors"
                        />
                    </div>


                    <div>
                        <label className="block text-white text-[12px] md:text-sm lg:text-sm mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            className="w-full h-10 md:h-10 lg:h-10 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-lg text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors"
                        />
                    </div>





                </form>
                <div className="mt-8">
                    <Button isWhite={true} isWidthFull={true} lgHeight="h-10" >
                        Continuar
                    </Button>
                </div>

                <div className="flex items-center">
                    <div className="flex-1 h-px bg-gray-600"></div>
                    <div className="mx-4 flex items-center">
                        <span className="text-white text-[3em] font-bold">o</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-600"></div>
                </div>


                <button className="w-full h-10 md:h-12 lg:h-10 bg-white text-gray-700 rounded-lg flex items-center justify-center gap-3 font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                    <FcGoogle size={20} />
                    Sign In with Google
                </button>


                <p className="text-gray-400 text-center mt-6 text-sm">
                    ¿Aún no tenés una cuenta?
                    <span className="text-white hover:text-quaternary cursor-pointer ml-1" onClick={onSwitchToSignUp}>
                        Registrate
                    </span>
                </p>
            </div>
        </div>
    )
}