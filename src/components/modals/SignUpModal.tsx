import { Button } from "../Button"
import { FcGoogle } from "react-icons/fc"
import { LuX, LuEye, LuEyeOff } from "react-icons/lu"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../store"
import { signupManual } from "../../store/slices/userSlice"

interface SignUpModalProps {
    onClose?: () => void
    onSwitchToLogin?: () => void
}

export const SignUpModal = ({ onClose, onSwitchToLogin }: SignUpModalProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error } = useSelector((s: RootState) => s.user)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setLocalError(null)
        if (!email || !password) {
            setLocalError('Email y contraseña son obligatorios')
            return
        }
        if (password !== confirmPassword) {
            setLocalError('Las contraseñas no coinciden')
            return
        }
        try {
            await dispatch(signupManual({ email, password, name })).unwrap()
            // On success close modal
            onClose?.()
        } catch (err: any) {
            // error handled in slice; keep local for quick display
            setLocalError(err?.message ?? 'Error al registrar')
        }
    }

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-primary rounded-lg border border-white/10 p-8 w-[550px] max-w-[90vw] h-fit">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    <LuX size={20} />
                </button>

                <h2 className="text-white text-[1.5em] md:text-[2em] lg:text-[2em] font-bold text-center mb-6">
                    Registrate
                </h2>


                <form className="grid grid-flow-col grid-rows-2 gap-4" onSubmit={handleSubmit}>

                    <div className="relative">
                        <label className="block text-white text-[12px] md:text-sm lg:text-sm mb-2">
                            Nombre 
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Ingrese su nombre"
                            className="w-full h-10 md:h-10 lg:h-10 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-lg text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors"
                        />
                    </div>


                    <div className="relative">
                        <label className="block text-white text-[12px] md:text-sm lg:text-sm mb-2">
                            Correo
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Ingrese su email"
                            className="w-full h-10 md:h-10 lg:h-10 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-lg text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors"
                        />
                    </div>


                    <div className="relative">
                        <label className="block text-white text-[12px] md:text-sm lg:text-sm mb-2">
                            Contraseña
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                                                        type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••••••"
                            className="w-full h-10 md:h-10 lg:h-10 px-4 pr-10 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-lg text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors"
                        />
                        <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-[38px]  text-gray-300">
                                                    {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                        </button>
                    </div>


                    <div className="relative">
                        <label className="block text-white text-[12px] md:text-sm lg:text-sm mb-2">
                            Repetir contraseña
                        </label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                        type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••••••"
                            className="w-full h-10 md:h-10 lg:h-10 px-4 pr-10 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-lg text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(s => !s)} className="absolute right-3 top-[38px]  text-gray-300">
                            {showConfirmPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                        </button>
                    </div>



                </form>
                <div className="mt-8">
                    <Button isWhite={true} isWidthFull={true} lgHeight="h-10" action={handleSubmit} isBlocked={loading}>
                        {loading ? 'Creando cuenta...' : 'Continuar'}
                    </Button>
                </div>

                {(localError || error) && (
                    <p className="text-red-400 text-center mt-4">{localError ?? error}</p>
                )}

                <div className="flex items-center">
                    <div className="flex-1 h-px bg-gray-600"></div>
                    <div className="mx-4 flex items-center">
                        <span className="text-white text-[3em] font-bold">o</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-600"></div>
                </div>


                <button className="w-full h-10 md:h-12 lg:h-10 bg-white text-gray-700 rounded-lg flex items-center justify-center gap-3 font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                    <FcGoogle size={20} />
                    Sign Up with Google
                </button>


                <p className="text-gray-400 text-center mt-6 text-sm">
                    ¿Ya tenés cuenta?
                    <span className="text-white hover:text-quaternary cursor-pointer ml-1" onClick={onSwitchToLogin}>
                        Iniciá sesión
                    </span>
                </p>
            </div>
        </div>
    )
}