import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../services/UsuarioService";
import { UsernameModal } from "../components/modals/UsernameModal";

export const CallbackView = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
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

          console.log("Token obtenido correctamente");
          console.log("Usuario de Auth0:", user);

          // Guardar el token para uso posterior
          setAccessToken(token);

          // Intentar obtener el usuario existente
          let userData;
          let userWasCreated = false;
          
          try {
            userData = await usuarioService.getCurrentUser(token);
            console.log('Usuario existente encontrado:', userData);
          } catch (error) {
            // Usuario no existe, crear uno nuevo
            console.log('Usuario no existe, procediendo a registrar...');
            userData = await usuarioService.signupUser(token);
            userWasCreated = true;
            console.log('Usuario registrado exitosamente:', userData);
          }

          // Si es un usuario nuevo y no tiene name (username), mostrar modal
          if (userWasCreated && !userData.name) {
            setShowUsernameModal(true);
          } else {
            // Si no es nuevo o ya tiene name, ir al dashboard
            console.log("✅ Proceso completado - Usuario:", userData);
            navigate("/", { replace: true });
          }
        } catch (err: any) {
          console.error("Error en callback de autenticación:", err);
          setError(err.message || "Error al conectar con el servidor. Por favor, intenta nuevamente.");
        }
      }
    };

    if (!isLoading) {
      handleAuthCallback();
    }
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently, navigate, registering]);

  const handleUsernameSubmit = async (username: string) => {
    if (!accessToken) return;
    
    setIsSavingUsername(true);
    try {
      await usuarioService.setUsername(accessToken, username);
      console.log("✅ Username establecido correctamente:", username);
      
      // Cerrar modal y redirigir
      setShowUsernameModal(false);
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("Error al establecer username:", err);
      setError(err.message || "Error al guardar el nombre de usuario. Por favor, intenta nuevamente.");
      setShowUsernameModal(false);
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleSkipUsername = () => {
    console.log("Usuario saltó la configuración de username");
    setShowUsernameModal(false);
    navigate("/", { replace: true });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center max-w-md p-8 bg-itemsCard rounded-lg border border-white/10">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Error al iniciar sesión</h2>
          <p className="text-quaternary mb-6">{error}</p>
          <button
            onClick={() => navigate("/landing")}
            className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Volver al inicio
          </button>
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
