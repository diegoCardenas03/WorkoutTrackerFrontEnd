import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUserRole } from "../hooks/useUserRole";
import type { UserRole } from "../hooks/useUserRole";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  /**
   * Si true, permite acceso a roles superiores en la jerarquía
   * Ejemplo: allowedRoles=['ADMIN'] + requireExact=false → ADMIN y PROPIETARIO pueden acceder
   */
  requireExact?: boolean;
}

export const RoleProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = "/",
  requireExact = false
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { hasAnyRole, hasRoleOrHigher, isAdmin, isOwner, primaryRole } = useUserRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quaternary"></div>
          <p className="text-white mt-4 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }
  
  // Verificar permisos según el modo (exacto o jerárquico)
  const hasPermission = requireExact 
    ? hasAnyRole(allowedRoles) 
    : hasRoleOrHigher(allowedRoles);
  
  if (!hasPermission) {
    console.warn(`❌ Usuario sin permisos para acceder a esta ruta`);
    console.warn(`📋 Rol del usuario: ${primaryRole || 'NINGUNO'}`);
    console.warn(`✅ Roles permitidos: [${allowedRoles.join(', ')}]`);
    console.warn(`🔒 Modo: ${requireExact ? 'Exacto' : 'Jerárquico'}`);
    
    // Redirigir según el rol del usuario
    if (isOwner) {
      console.log('🔄 Propietario redirigido a /admin/profile');
      return <Navigate to="/admin/profile" replace />;
    }
    
    if (isAdmin) {
      console.log('🔄 Admin redirigido a /admin/profile');
      return <Navigate to="/admin/profile" replace />;
    }
    
    // En desarrollo, mostrar mensaje de ayuda
    if (import.meta.env.DEV) {
      console.error(`
🔧 SOLUCIÓN: El usuario no tiene los permisos necesarios.
   
   Rol actual: ${primaryRole || 'Sin rol'}
   Roles requeridos: ${allowedRoles.join(', ')}
   
   Jerarquía de roles:
   USUARIO (nivel 1) < ADMIN (nivel 2) < PROPIETARIO (nivel 3)
   
   Pasos para solucionar:
   1. Ve a tu dashboard de Auth0: https://manage.auth0.com/
   2. Navega a User Management → Users
   3. Selecciona tu usuario
   4. Ve a la pestaña "Roles"
   5. Asigna el rol apropiado
   6. Cierra sesión y vuelve a iniciar sesión
      `);
    }
    
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
