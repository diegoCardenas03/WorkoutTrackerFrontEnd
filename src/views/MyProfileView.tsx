import { LuSave, LuCamera, LuEye, LuEyeOff } from 'react-icons/lu'
import { Button } from '../components/Button'
import { PrivateLayout } from '../layouts/PrivateLayout'
import fotoPerfil from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\FotoPerfil.png"
import { SubHeader } from '../components/SubHeader'
import { useUser } from '../hooks/useUser'
import { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { usuarioService } from '../services/UsuarioService'
import { Toast } from '../components/Toast'
import { Spinner } from '../components/Spinner'

export const MyProfileView = () => {
  const { userData, isLoading, auth0User, refetch } = useUser();
  const { getAccessTokenSilently } = useAuth0();
  
  // Estados para manejar los campos editables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [initialLoading, setInitialLoading] = useState(true)
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verificar si es usuario de Google
  const isGoogleUser = auth0User?.sub?.includes('google-oauth2');

  // Actualizar estados cuando los datos del usuario se cargan
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email);
    }
  }, [userData]);

  // Delay profesional para carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setToastMessage('Por favor selecciona un archivo de imagen válido');
        setToastType('error');
        setShowToast(true);
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToastMessage('La imagen no puede superar los 5MB');
        setToastType('error');
        setShowToast(true);
        return;
      }

      setProfileImage(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Prioridad: preview temporal > imagen de Cloudinary > Auth0 > placeholder
  const profilePicture = imagePreview || userData?.pictureUrl || auth0User?.picture || fotoPerfil;

  if (initialLoading || isLoading) {
    return (
      <PrivateLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner message="Cargando perfil..." size="md" />
        </div>
      </PrivateLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!name.trim()) {
      setToastMessage("El nombre no puede estar vacío");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (name.trim().length < 2) {
      setToastMessage("El nombre debe tener al menos 2 caracteres");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (name.length > 50) {
      setToastMessage("El nombre no puede tener más de 50 caracteres");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Solo letras, números, espacios, acentos y apóstrofes
    const nameRegex = /^[a-zA-Z\u00c0-\u00ff0-9\s'.-]+$/;
    if (!nameRegex.test(name)) {
      setToastMessage("El nombre solo puede contener letras, números, espacios y caracteres válidos");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Si no es usuario de Google y quiere cambiar contraseña, validar
    if (!isGoogleUser && password) {
      if (password.length < 8) {
        setToastMessage("La contraseña debe tener al menos 8 caracteres");
        setToastType("error");
        setShowToast(true);
        return;
      }

      if (password !== confirmPassword) {
        setToastMessage("Las contraseñas no coinciden");
        setToastType("error");
        setShowToast(true);
        return;
      }
    }

    try {
      setIsSaving(true);

      // Obtener token
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      });

      // Preparar datos a enviar
      const updateData: any = {};
      
      // Incluir name si cambió (con trim para eliminar espacios extra)
      if (name.trim() && name.trim() !== userData?.name) {
        updateData.name = name.trim();
      }
      
      // Solo incluir password si se proporcionó y no es usuario de Google
      if (!isGoogleUser && password) {
        updateData.password = password;
      }

      // Siempre incluir picture de Auth0 para evitar null
      if (auth0User?.picture) {
        updateData.picture = auth0User.picture;
      }

      // Actualizar perfil
      console.log('📤 Enviando actualización de perfil:', updateData);
      await usuarioService.updateProfile(token, updateData, profileImage || undefined);
      
      // Recargar datos del usuario
      await refetch();

      // Emitir evento personalizado para notificar a otros componentes
      window.dispatchEvent(new CustomEvent('userProfileUpdated'));

      // Limpiar campos de contraseña y foto
      setPassword("");
      setConfirmPassword("");
      setProfileImage(null);
      setImagePreview(null);

      // Mostrar mensaje de éxito
      setToastMessage("Perfil actualizado correctamente");
      setToastType("success");
      setShowToast(true);
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      setToastMessage(err.message || "Error al actualizar el perfil");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PrivateLayout>
        <SubHeader nameView='Mi Perfil' description='Verifica o modifica tu información personal'/>
        <div className='flex items-center justify-center h-full'>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quaternary"></div>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <SubHeader nameView='Mi Perfil' description='Verifica o modifica tu información personal'/>

      <div className='flex flex-col items-center justify-start text-white h-full w-full'>
        <div className='flex flex-col md:flex-row items-center justify-center gap-3 md:gap-[5em] lg:gap-[5em] mt-[3em]'>
          <div className='flex flex-col h-full items-center'>
            <div className="relative">
              <img 
                className="w-[6em] h-[6em] md:w-[10em] md:h-[10em] lg:w-[10em] lg:h-[10em] 2xl:w-[10em] 2xl:h-[10em] rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                src={profilePicture} 
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

          <form className='flex flex-col gap-4 w-[20em] md:w-[25em] lg:w-[28em]' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
              <p className='font-light text-base'>Nombre de Usuario</p>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre"
                disabled={isSaving}
                className="w-full h-11 md:h-11 lg:h-11 2xl:h-12 px-4 text-[15px] md:text-[0.95em] lg:text-[1em] rounded-[5px] 2xl:text-[1.1em] text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className='font-light text-[11px] text-quaternary'>
                2-50 caracteres. Puedes usar tu nombre completo.
              </p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='font-light text-base'>Correo</p>
              <input
                type='email'
                value={email}
                disabled
                className="w-full h-11 md:h-11 lg:h-11 2xl:h-12 px-4 text-[15px] md:text-[0.95em] lg:text-[1em] rounded-[5px] 2xl:text-[1.1em] text-quaternary placeholder-gray-400 border border-white/30 cursor-not-allowed font-bold bg-white/5"
              />
              <p className='font-light text-[11px] text-quaternary'>El correo no se puede modificar</p>
            </div>
            
            {/* Mostrar campos de contraseña solo si NO es login de Google */}
            {!isGoogleUser && (
              <>
                <div className='flex flex-col gap-2'>
                  <p className='font-light text-base'>Contraseña Nueva (opcional)</p>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu nueva contraseña"
                      disabled={isSaving}
                      className="w-full h-11 md:h-11 lg:h-11 2xl:h-12 px-4 pr-12 text-[15px] md:text-[0.95em] lg:text-[1em] rounded-[5px] 2xl:text-[1.1em] text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSaving}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-quaternary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                    </button>
                  </div>
                  <p className='font-light text-[11px] text-quaternary'>
                    Mínimo 8 caracteres. Debe contener mayúsculas, minúsculas y símbolos.
                  </p>
                </div>

                <div className='flex flex-col gap-2'>
                  <p className='font-light text-base'>Confirmar Contraseña</p>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirma tu nueva contraseña"
                      disabled={isSaving}
                      className="w-full h-11 md:h-11 lg:h-11 2xl:h-12 px-4 pr-12 text-[15px] md:text-[0.95em] lg:text-[1em] rounded-[5px] 2xl:text-[1.1em] text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSaving}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-quaternary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showConfirmPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                    </button>
                  </div>
                  <p className='font-light text-[11px] text-quaternary'>
                    Las contraseñas deben coincidir
                  </p>
                </div>
              </>
            )}
            
            
            <div className='flex w-full justify-center mt-4 mb-6'>
              <Button isBold={true} mdHeight='h-8' lgHeight='h-10' iconPosition={false} icon={<LuSave />} isBlocked={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>

          {/* Toast de notificación */}
          <Toast
            open={showToast}
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        </div>

      </div>
    </PrivateLayout>
  )
}
