import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { usuarioService, type UsuarioResponseDTO } from "../services/UsuarioService";

/**
 * Hook personalizado para obtener y manejar los datos del usuario autenticado
 * @returns Objeto con los datos del usuario, estado de carga y función de recarga
 */
export const useUser = () => {
  const { isAuthenticated, isLoading: auth0Loading, getAccessTokenSilently, user: auth0User } = useAuth0();
  const [userData, setUserData] = useState<UsuarioResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!isAuthenticated || auth0Loading) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Obtener el token de acceso
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      });

      // 🔍 DEBUG: Decodificar el token para ver los roles
      console.log('🔑 [useUser] Token obtenido');
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('🔍 [DEBUG useUser] Token payload completo:', payload);
        console.log('🔍 [DEBUG useUser] Roles en el token:', payload[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]);
        console.log('🔍 [DEBUG useUser] ¿Tiene rol ADMIN?', payload[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]?.includes('ADMIN'));
        console.log('🔍 [DEBUG useUser] ¿Tiene rol USUARIO?', payload[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]?.includes('USUARIO'));
      } catch (e) {
        console.error('❌ Error al decodificar token:', e);
      }

      // Obtener los datos del usuario desde el backend
      const user = await usuarioService.getCurrentUser(token);
      setUserData(user);
    } catch (err: any) {
      console.error("Error al obtener datos del usuario:", err);
      setError(err.message || "Error al cargar los datos del usuario");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated, auth0Loading]);

  return {
    userData,
    isLoading,
    error,
    refetch: fetchUserData,
    auth0User, // Datos básicos de Auth0 (para foto de perfil, etc)
  };
};
