import { useAuth0 } from "@auth0/auth0-react";

export type UserRole = 'USUARIO' | 'ADMIN' | 'EMPLEADO';

const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

export const useUserRole = () => {
  const { user } = useAuth0();

  // Los roles vienen del backend en el token JWT bajo un namespace personalizado
  const roles = (user?.[`${VITE_AUTH0_AUDIENCE}/roles`] as string[]) || [];
  
  // Debug: exponer usuario para debugging (solo en desarrollo)
  if (import.meta.env.DEV && user) {
    (window as any).__auth0User = user;
    console.log('🔐 Auth0 User Debug:', {
      email: user.email,
      roles: roles,
      fullUser: user
    });
  }

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (allowedRoles: UserRole[]): boolean => {
    return allowedRoles.some(role => roles.includes(role));
  };

  const isAdmin = hasRole('ADMIN');
  const isEmployee = hasRole('EMPLEADO');
  const isUser = hasRole('USUARIO');

  // Obtener el rol principal (primer rol del array)
  const primaryRole = roles[0] as UserRole | undefined;

  return {
    roles,
    primaryRole,
    hasRole,
    hasAnyRole,
    isAdmin,
    isEmployee,
    isUser,
  };
};
