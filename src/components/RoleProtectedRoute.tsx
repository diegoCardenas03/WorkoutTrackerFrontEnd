import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUserRole } from "../hooks/useUserRole";
import type { UserRole } from "../hooks/useUserRole";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = "/" 
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { hasAnyRole, roles, isAdmin } = useUserRole();

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
  
  // Verificar si el usuario tiene alguno de los roles permitidos
  if (!hasAnyRole(allowedRoles)) {
    console.warn(`❌ Usuario sin permisos para acceder a esta ruta`);
    console.warn(`📋 Roles del usuario: [${roles.join(', ') || 'NINGUNO'}]`);
    console.warn(`✅ Roles permitidos: [${allowedRoles.join(', ')}]`);
    
    // Si es ADMIN intentando acceder a rutas de usuario, redirigir a /admin/profile
    if (isAdmin) {
      console.log('🔄 Admin redirigido a /admin/profile');
      return <Navigate to="/admin/profile" replace />;
    }
    
    // En desarrollo, mostrar mensaje de ayuda
    if (import.meta.env.DEV) {
      console.error(`
🔧 SOLUCIÓN: El usuario no tiene roles asignados en Auth0.
   
   Pasos para solucionar:
   1. Ve a tu dashboard de Auth0: https://manage.auth0.com/
   2. Navega a User Management → Users
   3. Selecciona tu usuario
   4. Ve a la pestaña "Roles"
   5. Asigna el rol "USUARIO" o "ADMIN"
   6. Cierra sesión y vuelve a iniciar sesión
   
   Ver más detalles en: AUTH0_ROLES_SETUP.md
      `);
    }
    
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
