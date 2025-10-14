import { useAuth0 } from "@auth0/auth0-react";

export type UserRole = 'USUARIO' | 'ADMIN' | 'PROPIETARIO';

const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

/**
 * Jerarquía de roles (de menor a mayor privilegio):
 * USUARIO < ADMIN < PROPIETARIO
 * 
 * - USUARIO: Acceso básico a funcionalidades de la app
 * - ADMIN: Gestión de ejercicios, zonas musculares, equipamiento, usuarios
 * - PROPIETARIO: Todos los permisos de ADMIN + gestión de administradores
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'USUARIO': 1,
  'ADMIN': 2,
  'PROPIETARIO': 3,
};

export const useUserRole = () => {
  const { user } = useAuth0();

  // Los roles vienen del backend en el token JWT bajo un namespace personalizado
  const roles = (user?.[`${VITE_AUTH0_AUDIENCE}/roles`] as string[]) || [];
  
  // Debug: exponer usuario para debugging (solo en desarrollo)
  if (import.meta.env.DEV && user) {
    (window as any).__auth0User = user;
    // console.log('🔐 Auth0 User Debug:', {
    //   email: user.email,
    //   roles: roles,
    //   fullUser: user
    // });
  }

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  /**
   * Verifica si el usuario tiene alguno de los roles permitidos
   */
  const hasAnyRole = (allowedRoles: UserRole[]): boolean => {
    return allowedRoles.some(role => roles.includes(role));
  };

  /**
   * Verifica si el usuario tiene un rol con nivel igual o superior al especificado
   * Ejemplo: Si allowedRoles = ['ADMIN'], entonces ADMIN y PROPIETARIO pueden acceder
   */
  const hasRoleOrHigher = (allowedRoles: UserRole[]): boolean => {
    // Obtener el nivel mínimo requerido
    const minRequiredLevel = Math.min(
      ...allowedRoles.map(role => ROLE_HIERARCHY[role] || 0)
    );

    // Obtener el nivel máximo del usuario
    const userMaxLevel = Math.max(
      ...roles
        .filter((role): role is UserRole => role in ROLE_HIERARCHY)
        .map(role => ROLE_HIERARCHY[role]),
      0
    );

    return userMaxLevel >= minRequiredLevel;
  };

  const isOwner = hasRole('PROPIETARIO');
  const isAdmin = hasRole('ADMIN');
  const isUser = hasRole('USUARIO');

  // Obtener el rol principal (rol de mayor jerarquía)
  const primaryRole = roles
    .filter((role): role is UserRole => role in ROLE_HIERARCHY)
    .sort((a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a])[0] as UserRole | undefined;

  /**
   * Obtener nivel de jerarquía del usuario (rol más alto)
   */
  const userLevel = primaryRole ? ROLE_HIERARCHY[primaryRole] : 0;

  return {
    roles,
    primaryRole,
    userLevel,
    hasRole,
    hasAnyRole,
    hasRoleOrHigher,
    isOwner,
    isAdmin,
    isUser,
  };
};
