import { LuSave } from 'react-icons/lu'
import { Button } from '../../components/Button'

import fotoPerfil from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\FotoPerfil.png"
import { AdminLayout } from '../../layouts/admin/AdminLayout'


export const MyProfileAdminView = () => {
    return (
        <>
        <AdminLayout>

        
            <div className="bg-tertiary border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-white text-2xl font-semibold mb-2">Mi Perfil</h1>
                        <p className="text-quaternary text-sm">Verifica o corrige tu informacion</p>
                    </div>


                </div>
            </div>

            <div className='flex flex-col items-center justify-start text-white h-full w-full'>
                <div className='flex flex-col md:flex-row items-center justify-center gap-3 md:gap-[5em] lg:gap-[5em] mt-[3em]'>
                    <div className='flex flex-col h-full'>
                        <img className="w-[6em] h-[6em] md:w-[10em] md:h-[10em] lg:w-[10em] lg:h-[10em] 2xl:w-[10em] 2xl:h-[10em] cursor-pointer hover:opacity-80 transition-opacity" src={fotoPerfil} alt="fotoPerfil" />
                    </div>

                    <form className='flex flex-col gap-4 w-[20em] md:w-fit'>
                        <div className='flex flex-col gap-2'>
                            <p className='font-light'>Nombre completo</p>
                            <input
                                type='text'
                                value={"Gero"}
                                className="w-full h-10 md:h-10 lg:h-10 2xl:h-11 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-[5px] 2xl:text-[1em] text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors font-bold"
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='font-light'>Correo electrónico</p>
                            <input
                                type='email'
                                value={"admin@tengo3prop.gmail.com"}
                                className="w-full h-10 md:h-10 lg:h-10 2xl:h-11 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-[5px] 2xl:text-[1em] text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors font-bold"
                            />
                        </div>


                        <div className='flex flex-col gap-2'>
                            <p className='font-light'>Contraseña</p>
                            <input
                                value={'***********'}
                                type='password'
                                placeholder="Ingresa tu nueva contraseña"
                                className="w-full h-10 md:h-10 lg:h-10 2xl:h-11 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-[5px] 2xl:text-[1em] text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors"
                            />
                            <p className='font-light text-[12px]'>Debe contener un mínimo de 8 caracteres, una letra mayúscula, una minúscula y un símbolo</p>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='font-light'>Repetir contraseña</p>
                            <input
                                type='password'
                                placeholder="Confirma tu nueva contraseña"
                                className="w-full h-10 md:h-10 lg:h-10 2xl:h-11 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-[5px] 2xl:text-[1em] text-white placeholder-quaternary border border-white focus:border-quaternary focus:outline-none transition-colors"
                            />
                            <p className='font-light text-[12px]'>Las contraseñas deben coincidir</p>
                        </div>

                        <div className='flex w-full justify-center mt-4 mb-6'>
                            <Button isBold={true} mdHeight='h-8' lgHeight='h-10' iconPosition={false} icon={<LuSave />}>
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            </AdminLayout>
        </>
    )
}