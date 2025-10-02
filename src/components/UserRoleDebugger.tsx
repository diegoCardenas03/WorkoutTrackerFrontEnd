import { useAuth0 } from "@auth0/auth0-react";
import { useUserRole } from "../hooks/useUserRole";

/**
 * Componente de debugging para mostrar información del usuario y roles
 * Solo para desarrollo - eliminar en producción
 */
export const UserRoleDebugger = () => {
  const { user, isAuthenticated } = useAuth0();
  const { roles, isAdmin, isEmployee, isUser } = useUserRole();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-lg mb-2">User Role Debugger</h3>
      <div className="text-sm space-y-1">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Roles:</strong> {roles.length > 0 ? roles.join(', ') : 'Sin roles'}</p>
        <div className="mt-2 space-y-1">
          <p className={isUser ? "text-green-400" : "text-red-400"}>
            ✓ USUARIO: {isUser ? "Sí" : "No"}
          </p>
          <p className={isAdmin ? "text-green-400" : "text-red-400"}>
            ✓ ADMIN: {isAdmin ? "Sí" : "No"}
          </p>
          <p className={isEmployee ? "text-green-400" : "text-red-400"}>
            ✓ EMPLEADO: {isEmployee ? "Sí" : "No"}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Eliminar este componente en producción
      </p>
    </div>
  );
};
