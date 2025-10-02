import { LuSave } from 'react-icons/lu'
import { Button } from '../components/Button'
import { PrivateLayout } from '../layouts/PrivateLayout'
import fotoPerfil from "../assets/FotoPerfil.png"
import { SubHeader } from '../components/SubHeader'
import { useUser } from '../hooks/useUser'
import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { usuarioService } from '../services/UsuarioService'
import { Toast } from '../components/Toast'

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

  // Verificar si es usuario de Google
  const isGoogleUser = auth0User?.sub?.includes('google-oauth2');

  // Actualizar estados cuando los datos del usuario se cargan
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email);
    }
  }, [userData]);

  const profilePicture = auth0User?.picture || fotoPerfil;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!name.trim()) {
      setToastMessage("El nombre de usuario no puede estar vacío");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (name.length < 3) {
      setToastMessage("El nombre de usuario debe tener al menos 3 caracteres");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (name.length > 20) {
      setToastMessage("El nombre de usuario no puede tener más de 20 caracteres");
      setToastType("error");
      setShowToast(true);
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(name)) {
      setToastMessage("El nombre de usuario solo puede contener letras, números, guiones y guiones bajos");
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
      
      // Incluir name si cambió
      if (name.trim() && name !== userData?.name) {
        updateData.name = name;
      }
      
      // Solo incluir password si se proporcionó y no es usuario de Google
      if (!isGoogleUser && password) {
        updateData.password = password;
      }

      // Actualizar perfil
      await usuarioService.updateProfile(token, updateData);
      
      // Recargar datos del usuario
      await refetch();

      // Limpiar campos de contraseña
      setPassword("");
      setConfirmPassword("");

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
          <div className='flex flex-col h-full'>
            <img 
              className="w-[6em] h-[6em] md:w-[10em] md:h-[10em] lg:w-[10em] lg:h-[10em] 2xl:w-[10em] 2xl:h-[10em] rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity" 
              src={profilePicture} 
              alt="fotoPerfil" 
            />
          </div>

          <form className='flex flex-col gap-4 w-[20em] md:w-[25em] lg:w-[28em]' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
              <p className='font-light text-base'>Nombre de Usuario</p>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre de usuario"
                className="w-full h-11 md:h-11 lg:h-11 2xl:h-12 px-4 text-[15px] md:text-[0.95em] lg:text-[1em] rounded-[5px] 2xl:text-[1.1em] text-white placeholder-gray-400 border border-white focus:border-quaternary focus:outline-none transition-colors font-bold"
              />
              <p className='font-light text-[11px] text-quaternary'>
                3-20 caracteres. Solo letras, números, guiones y guiones bajos
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
            
            {/* Mostrar campo de contraseña solo si NO es login de Google */}
            {auth0User?.sub && !auth0User.sub.includes('google-oauth2') && (
              <div className='flex flex-col gap-2'>
                <p className='font-light text-base'>Contraseña</p>
                <input
                  type='password'
                  value='**********'
                  className="w-full h-11 md:h-11 lg:h-11 2xl:h-12 px-4 text-[15px] md:text-[0.95em] lg:text-[1em] rounded-[5px] 2xl:text-[1.1em] text-quaternary placeholder-gray-400 border border-white/30 cursor-not-allowed bg-white/5"
                />
              </div>
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
