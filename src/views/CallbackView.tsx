import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usuarioService } from "../services/UsuarioService";
import { UsernameModal } from "../components/modals/UsernameModal";

export const CallbackView = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user, error: auth0Error } = useAuth0();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  // Verificar errores de Auth0 en la URL primero
  useEffect(() => {
    const urlError = searchParams.get('error');
    const urlErrorDescription = searchParams.get('error_description');

    if (urlError) {
      // console.error('🚨 [CallbackView] Error de Auth0 en URL:', urlError, urlErrorDescription);
      
      let message = '';
      if (urlError === 'access_denied') {
        message = 'Cancelaste el proceso de autorización. Para usar la aplicación, necesitas aceptar los permisos solicitados.';
      } else {
        message = urlErrorDescription || 'Ocurrió un error durante la autenticación.';
      }
      
      setError(message);
      
      // Limpiar el estado de autenticación de Auth0 en localStorage
      // para evitar loops infinitos
      try {
        const auth0Keys = Object.keys(localStorage).filter(key => 
          key.startsWith('@@auth0spajs@@') || key.startsWith('a0.spajs')
        );
        auth0Keys.forEach(key => {
          // console.log('🗑️ Limpiando clave de Auth0:', key);
          localStorage.removeItem(key);
        });
      } catch (e) {
        // console.error('Error al limpiar localStorage:', e);
      }
    }

    if (auth0Error) {
      // console.error('🚨 [CallbackView] Error de Auth0 hook:', auth0Error);
      setError(auth0Error.message || 'Error de autenticación.');
    }
  }, [searchParams, auth0Error]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Si hay error, no proceder
      if (error) {
        // console.log('⚠️ [CallbackView] Callback detenido por error:', error);
        return;
      }

      if (isAuthenticated && user && !registering) {
        setRegistering(true);
        try {
          // Obtener el token de acceso con scopes completos
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: "openid profile email",
            },
          });

          // console.log("Token obtenido correctamente");
          // console.log("Usuario de Auth0:", user);

          // Guardar el token para uso posterior
          setAccessToken(token);

          // Intentar obtener el usuario existente
          let userData;
          let userWasCreated = false;
          
          // console.log('📋 [CallbackView] Verificando si usuario ya existe en backend...');
          try {
            userData = await usuarioService.getCurrentUser(token);
            
            // console.log('✅ [CallbackView] Usuario YA EXISTE en backend:', userData);
          } catch (error) {
            // Usuario no existe, crear uno nuevo
            // console.log('❌ [CallbackView] Usuario NO EXISTE en backend, procediendo a registrar...');
            // console.log('🚀 [CallbackView] Llamando a usuarioService.signupUser()...');
            userData = await usuarioService.signupUser(token);
            userWasCreated = true;
            // console.log('✅ [CallbackView] Usuario CREADO exitosamente:', userData);
            // console.log('📊 [CallbackView] userWasCreated =', userWasCreated);

            // IMPORTANTE: Cuando se crea un usuario nuevo, Auth0 necesita tiempo para asignar roles
            // Esperamos un momento y luego forzamos la renovación del token para obtener los roles
            // console.log('⏱️ [CallbackView] Usuario NUEVO creado - esperando 2s para que Auth0 asigne roles...');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos

            // Forzar renovación del token sin caché para obtener los claims con roles
            // console.log('🔄 [CallbackView] Renovando token con cacheMode: off para obtener roles actualizados...');
            const refreshedToken = await getAccessTokenSilently({
              authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                scope: "openid profile email",
              },
              cacheMode: 'off', // No usar caché, forzar renovación
            });
            // console.log('✅ [CallbackView] Token renovado exitosamente');
            // console.log('🔍 [CallbackView] Nuevo token obtenido (primeros 50 chars):', refreshedToken.substring(0, 50) + '...');
          }

          // Verificar si es primera vez que inicia sesión
          // console.log('🔍 [CallbackView] Verificando si mostrar modal de username...');
          // console.log('📊 [CallbackView] userWasCreated:', userWasCreated);
          // console.log('📊 [CallbackView] userData.createdAt:', userData?.createdAt);
          // console.log('📊 [CallbackView] userData.lastAccess:', userData?.lastAccess);
          // console.log('📊 [CallbackView] userData.name:', userData?.name);
          // console.log('📊 [CallbackView] userData.pictureUrl:', userData?.pictureUrl);
          
          // Calcular si debe mostrar el modal:
          // 1. Si userWasCreated = true (usuario acabó de crearse en este login)
          // 2. Si lastAccess es null (nunca ha accedido antes)
          // 3. Si createdAt y lastAccess son muy cercanos (menos de 10 segundos)
          // 4. PERO NO mostrar si ya tiene nombre con espacios (indica configuración manual previa)
          // 5. PERO NO mostrar si ya tiene imagen de Cloudinary (no de Auth0)
          
          let isFirstLogin = userWasCreated;
          
          if (!isFirstLogin && userData) {
            if (!userData.lastAccess) {
              // Si no tiene lastAccess, es primera vez
              isFirstLogin = true;
              // console.log('🆕 [CallbackView] Primera vez: lastAccess es null');
            } else {
              // Comparar createdAt con lastAccess (si son muy cercanos, es primera vez)
              const createdAt = new Date(userData.createdAt);
              const lastAccess = new Date(userData.lastAccess);
              const diffInSeconds = (lastAccess.getTime() - createdAt.getTime()) / 1000;
              
              if (diffInSeconds < 10) {
                isFirstLogin = true;
                // console.log(`🆕 [CallbackView] Primera vez: createdAt y lastAccess muy cercanos (${diffInSeconds.toFixed(2)} seg)`);
              }
            }
          }
          
          // Verificar si el usuario ya configuró su perfil (tiene nombre con espacios o imagen de Cloudinary)
          const hasCustomName = userData?.name && userData.name.includes(' ');
          const hasCloudinaryImage = userData?.pictureUrl && userData.pictureUrl.includes('cloudinary');
          const alreadyConfigured = hasCustomName || hasCloudinaryImage;
          
          // Verificar si el usuario es admin o propietario
          const isAdminOrOwner = userData?.role && 
            (userData.role.name === 'ADMIN' || userData.role.name === 'PROPIETARIO');
          
          if (alreadyConfigured) {
            // console.log('✅ [CallbackView] Usuario ya configuró su perfil previamente');
            // console.log('📊 [CallbackView] hasCustomName:', hasCustomName, '| hasCloudinaryImage:', hasCloudinaryImage);
            isFirstLogin = false;
          }
          
          if (isAdminOrOwner) {
            // console.log('👔 [CallbackView] Usuario es ADMIN o PROPIETARIO - No mostrar modal de configuración');
            isFirstLogin = false;
          }
          
          if (isFirstLogin && !alreadyConfigured && !isAdminOrOwner) {
            // console.log('📝 [CallbackView] Primera vez Y sin configurar - Mostrando modal de username');
            setShowUsernameModal(true);
          } else {
            // Si no es primera vez o ya está configurado, ir directo al dashboard
            // console.log("✅ [CallbackView] Usuario existente o ya configurado - Navegando a /");
            // console.log("📊 [CallbackView] Usuario final:", userData);
            navigate("/", { replace: true });
          }
        } catch (err: any) {
          // console.error("Error en callback de autenticación:", err);
          setError(err.message || "Error al conectar con el servidor. Por favor, intenta nuevamente.");
        }
      }
    };

    if (!isLoading) {
      handleAuthCallback();
    }
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently, navigate, registering, error]);

  const handleUsernameSubmit = async (username: string, profileImage?: File) => {
    if (!accessToken) return;
    
    setIsSavingUsername(true);
    try {
      await usuarioService.setUsername(accessToken, username, profileImage);
      // console.log("✅ Username y foto de perfil establecidos correctamente:", username);
      
      // Cerrar modal y redirigir
      setShowUsernameModal(false);
      navigate("/", { replace: true });
    } catch (err: any) {
      // console.error("Error al establecer username:", err);
      setError(err.message || "Error al guardar el nombre de usuario. Por favor, intenta nuevamente.");
      setShowUsernameModal(false);
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleSkipUsername = async () => {
    if (!accessToken || !user?.email) {
      // console.log("⚠️ Usuario saltó la configuración sin token o email");
      setShowUsernameModal(false);
      navigate("/", { replace: true });
      return;
    }

    setIsSavingUsername(true);
    try {
      // Extraer nombre del email (antes del @)
      const emailUsername = user.email.split('@')[0];
      
      // Capitalizar primera letra de cada palabra
      const formattedName = emailUsername
        .split(/[._-]/) // Separar por puntos, guiones bajos o guiones
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      // console.log(`📧 [CallbackView] Usuario saltó configuración - usando nombre del email: "${formattedName}"`);
      
      // Obtener imagen de Auth0 si existe
      const auth0Picture = user.picture;
      if (auth0Picture) {
        // console.log(`🖼️ [CallbackView] Asignando imagen de Auth0: ${auth0Picture}`);
        await usuarioService.setUsername(accessToken, formattedName, undefined, auth0Picture);
      } else {
        // console.log(`📷 [CallbackView] Sin imagen de Auth0 - usando imagen por defecto`);
        await usuarioService.setUsername(accessToken, formattedName);
      }
      
      // console.log("✅ Nombre e imagen por defecto establecidos correctamente:", formattedName);
      
      setShowUsernameModal(false);
      navigate("/", { replace: true });
    } catch (err: any) {
      // console.error("Error al establecer nombre por defecto:", err);
      // Aunque falle, dejamos que el usuario entre
      setShowUsernameModal(false);
      navigate("/", { replace: true });
    } finally {
      setIsSavingUsername(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center max-w-md p-8 bg-itemsCard rounded-lg border border-white/10">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">
            Cuenta creada pero permisos rechazados.
          </h2>
          <p className="text-quaternary mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                // Limpiar completamente la URL y el estado antes de volver
                window.history.replaceState({}, document.title, "/landing");
                navigate("/landing", { replace: true });
              }}
              className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Volver al inicio
            </button>
            <p className="text-quaternary text-sm">
              Si cambias de opinión, puedes intentar registrarte nuevamente desde la página de inicio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-quaternary mb-4"></div>
          <h2 className="text-white text-2xl font-bold mb-2">Completando inicio de sesión...</h2>
          <p className="text-quaternary">Por favor espera un momento</p>
        </div>
      </div>

      {/* Modal para establecer username en nuevos usuarios */}
      <UsernameModal
        isOpen={showUsernameModal}
        onSubmit={handleUsernameSubmit}
        onSkip={handleSkipUsername}
        isLoading={isSavingUsername}
      />
    </>
  );
};
