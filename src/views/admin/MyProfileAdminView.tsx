import { LuSave, LuCamera } from 'react-icons/lu'
import { Button } from '../../components/Button'
import { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { usuarioService } from '../../services/UsuarioService'
import type { UsuarioUpdateRequestDTO } from '../../types/usuario/UsuarioUpdateRequestDTO'
import { Toast } from '../../components/Toast'

import { AdminLayout } from '../../layouts/admin/AdminLayout'
import { useUser } from '../../hooks/useUser'


export const MyProfileAdminView = () => {
    const { userData, isLoading: userLoading, refetch, auth0User } = useUser()
    const { getAccessTokenSilently } = useAuth0()
    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [showErrorToast, setShowErrorToast] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Cargar datos del usuario cuando estén disponibles
    useEffect(() => {
        if (userData) {
            setName(userData.name || "")
            setEmail(userData.email || "")
        }
    }, [userData])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Por favor selecciona un archivo de imagen válido')
                setShowErrorToast(true)
                return
            }

            // Validar tamaño (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage('La imagen no puede superar los 5MB')
                setShowErrorToast(true)
                return
            }

            setProfileImage(file)

            // Crear preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSaveChanges = async () => {
        // Validaciones
        if (!name.trim()) {
            setErrorMessage("El nombre es requerido")
            setShowErrorToast(true)
            return
        }

        if (name.trim().length < 2) {
            setErrorMessage("El nombre debe tener al menos 2 caracteres")
            setShowErrorToast(true)
            return
        }

        if (name.length > 50) {
            setErrorMessage("El nombre no puede tener más de 50 caracteres")
            setShowErrorToast(true)
            return
        }

        // Solo letras, números, espacios, acentos y apóstrofes
        const nameRegex = /^[a-zA-Z\u00c0-\u00ff0-9\s'.-]+$/
        if (!nameRegex.test(name)) {
            setErrorMessage("El nombre solo puede contener letras, números, espacios y caracteres válidos")
            setShowErrorToast(true)
            return
        }

        if (password && password !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden")
            setShowErrorToast(true)
            return
        }

        if (password && password.length < 8) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres")
            setShowErrorToast(true)
            return
        }

        try {
            setIsSaving(true)
            
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    scope: "openid profile email",
                },
            })

            // Preparar datos para actualizar
            const updateData: UsuarioUpdateRequestDTO = {}
            
            if (name.trim() !== userData?.name) {
                updateData.name = name.trim()
            }
            
            if (password) {
                updateData.password = password
            }

            // Siempre incluir picture de Auth0 para evitar null en backend
            if (auth0User?.picture) {
                updateData.picture = auth0User.picture
            }

            // Solo hacer la petición si hay cambios
            if (Object.keys(updateData).length > 0 || profileImage) {
                console.log('💾 [MyProfileAdminView] Actualizando perfil con:', updateData);
                await usuarioService.updateProfile(token, updateData, profileImage || undefined)
                await refetch() // Recargar datos del usuario
                
                // Emitir evento personalizado para notificar a otros componentes
                window.dispatchEvent(new CustomEvent('userProfileUpdated'));
                
                setPassword("")
                setConfirmPassword("")
                setProfileImage(null)
                setImagePreview(null)
                setShowSuccessToast(true)
            } else {
                setErrorMessage("No hay cambios para guardar")
                setShowErrorToast(true)
            }
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error)
            setErrorMessage(error.message || "Error al actualizar el perfil")
            setShowErrorToast(true)
        } finally {
            setIsSaving(false)
        }
    }

    if (userLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen bg-primary">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quaternary"></div>
                        <p className="text-white mt-4 text-lg">Cargando perfil...</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

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
                    <div className='flex flex-col h-full items-center'>
                        <div className="relative">
                            <img 
                                className="w-[6em] h-[6em] md:w-[10em] md:h-[10em] lg:w-[10em] lg:h-[10em] 2xl:w-[10em] 2xl:h-[10em] cursor-pointer hover:opacity-80 transition-opacity rounded-full object-cover border-4 border-quaternary" 
                                src={imagePreview || userData?.pictureUrl || auth0User?.picture} 
                                alt="fotoPerfil"
                                onClick={() => !isSaving && fileInputRef.current?.click()}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSaving}
                                className="absolute bottom-0 right-0 p-2 bg-white text-primary rounded-full hover:bg-white/90 transition-colors disabled:opacity-50 border-2 border-primary"
                            >
                                <LuCamera size={16} />
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {profileImage && (
                            <p className="text-quaternary text-xs mt-2">{profileImage.name}</p>
                        )}
                    </div>

                    <div className='flex flex-col gap-4 w-[20em] md:w-fit'>
                        <div className='flex flex-col gap-2'>
                            <p className='font-light'>Nombre completo</p>
                            <input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isSaving}
                                className="w-full h-10 md:h-10 lg:h-10 2xl:h-11 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-[5px] 2xl:text-[1em] text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='font-light'>Correo electrónico</p>
                            <input
                                type='email'
                                value={email}
                                readOnly
                                disabled
                                className="w-full h-10 md:h-10 lg:h-10 2xl:h-11 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-[5px] 2xl:text-[1em] text-white/60 placeholder-gray-400 border border-white/30 bg-itemsCard cursor-not-allowed font-bold"
                            />
                            <p className='font-light text-[10px] text-quaternary'>El email no se puede modificar</p>
                        </div>


                        <div className='flex flex-col gap-2'>
                            <p className='font-light'>Contraseña Nueva (opcional)</p>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type='password'
                                disabled={isSaving}
                                placeholder="Ingresa tu nueva contraseña"
                                className="w-full h-10 md:h-10 lg:h-10 2xl:h-11 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-[5px] 2xl:text-[1em] text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <p className='font-light text-[12px]'>Debe contener un mínimo de 8 caracteres, una letra mayúscula, una minúscula y un símbolo</p>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='font-light'>Repetir contraseña</p>
                            <input
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isSaving}
                                placeholder="Confirma tu nueva contraseña"
                                className="w-full h-10 md:h-10 lg:h-10 2xl:h-11 px-4 text-[13px] md:text-[0.8em] lg:text-[0.8em] rounded-[5px] 2xl:text-[1em] text-white placeholder-quaternary border border-white focus:border-quaternary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <p className='font-light text-[12px]'>Las contraseñas deben coincidir</p>
                        </div>

                        <div className='flex w-full justify-center mt-4 mb-6'>
                            <Button 
                                isBold={true} 
                                mdHeight='h-8' 
                                lgHeight='h-10' 
                                iconPosition={false} 
                                icon={<LuSave />}
                                isBlocked={isSaving}
                                action={handleSaveChanges}
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Toasts */}
            <Toast
                open={showSuccessToast}
                type="success"
                message="Perfil actualizado exitosamente"
                onClose={() => setShowSuccessToast(false)}
                durationMs={3000}
            />
            <Toast
                open={showErrorToast}
                type="error"
                message={errorMessage}
                onClose={() => setShowErrorToast(false)}
                durationMs={4000}
            />
            </AdminLayout>
        </>
    )
}