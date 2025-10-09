import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";
import { DashBoardView } from "../views/DashBoardView";
import { useEffect, useState } from "react";

/**
 * Componente que redirige al dashboard apropiado según el rol del usuario
 * - PROPIETARIO → /admin/profile
 * - ADMIN → /admin/profile
 * - USUARIO → Dashboard normal
 * - Sin autenticar → /landing
 */
export const RootRedirect = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { isAdmin, isUser, isOwner, roles } = useUserRole();
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Si el usuario está autenticado pero no tiene roles, intentar refrescar el token
  useEffect(() => {
    const refreshTokenIfNeeded = async () => {
      if (isAuthenticated && !isLoading && roles.length === 0 && retryCount < 2 && !isRefreshing) {
        setIsRefreshing(true);
        console.log(`⚠️ Usuario autenticado sin roles detectados. Intento ${retryCount + 1}/2 de refrescar token...`);
        
        try {
          // Esperar un momento para que Auth0 procese la asignación de roles
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Forzar renovación del token sin caché
          await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: "openid profile email",
            },
            cacheMode: 'off',
          });
          
          console.log('✅ Token refrescado, verificando roles...');
          setRetryCount(prev => prev + 1);
        } catch (error) {
          console.error('❌ Error al refrescar token:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    refreshTokenIfNeeded();
  }, [isAuthenticated, isLoading, roles.length, retryCount, getAccessTokenSilently, isRefreshing]);

  if (isLoading || isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quaternary"></div>
          <p className="text-white mt-4 text-lg">Cargando...</p>
          {isRefreshing && (
            <p className="text-quaternary text-sm mt-2">Actualizando permisos...</p>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  // Si es PROPIETARIO o ADMIN, redirigir a perfil de admin
  if (isOwner || isAdmin) {
    const roleLabel = isOwner ? 'Propietario' : 'Admin';
    console.log(`🔄 ${roleLabel} detectado, redirigiendo a /admin/profile`);
    return <Navigate to="/admin/profile" replace />;
  }

  // Si es USUARIO, mostrar el dashboard
  if (isUser) {
    return <DashBoardView />;
  }

  // Si no tiene roles después de 2 intentos, mostrar mensaje de error
  if (retryCount >= 2) {
    console.error('❌ Usuario sin roles después de múltiples intentos');
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center max-w-md p-8 bg-itemsCard rounded-lg border border-white/10">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Configuración de cuenta pendiente</h2>
          <p className="text-quaternary mb-6">
            Tu cuenta necesita ser configurada por un administrador. Por favor, contacta al soporte.
          </p>
          <button
            onClick={() => window.location.href = '/landing'}
            className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Seguir cargando mientras se reintenta
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quaternary"></div>
        <p className="text-white mt-4 text-lg">Verificando permisos...</p>
      </div>
    </div>
  );
};
