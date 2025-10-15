import { IoClose } from "react-icons/io5"
import { Button } from "../../Button"
import type { UsuarioResponseDTO } from "../../../types/usuario/UsuarioResponseDTO"

interface MemberDataModalProps {
  isOpen: boolean
  onClose: () => void
  member: UsuarioResponseDTO | null
}

export const MemberDataModal = ({
  isOpen,
  onClose,
  member
}: MemberDataModalProps) => {
  if (!isOpen || !member) return null

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-primary border border-white/20 rounded-lg w-full max-w-md mx-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-lg font-semibold">
            Datos del usuario
          </h2>
          <button 
            onClick={onClose}
            className="text-quaternary hover:text-white transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Image */}
          <div className="flex justify-center">
            <img
              src={member.pictureUrl || 'https://cdn.auth0.com/avatars/default.png'}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
            />
          </div>

          {/* User Details */}
          <div className="space-y-4">
            {/* Nombres Completos */}
            <div>
              <label className="text-quaternary text-sm font-medium block mb-1">
                Nombres Completos
              </label>
              <p className="text-white text-sm bg-tertiary border border-white/20 rounded-lg p-3">
                {member.name}
              </p>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="text-quaternary text-sm font-medium block mb-1">
                Correo Electrónico
              </label>
              <p className="text-white text-sm bg-tertiary border border-white/20 rounded-lg p-3">
                {member.email}
              </p>
            </div>

            {/* Rol */}
            <div>
              <label className="text-quaternary text-sm font-medium block mb-1">
                Rol
              </label>
              <p className="text-white text-sm bg-tertiary border border-white/20 rounded-lg p-3 capitalize">
                {member.role?.name || 'Usuario'}
              </p>
            </div>

            {/* Estado */}
            <div>
              <label className="text-quaternary text-sm font-medium block mb-1">
                Estado
              </label>
              <p className={`text-sm border border-white/20 rounded-lg p-3 ${
                member.active ? 'text-green-500' : 'text-red-500'
              }`}>
                {member.active ? 'Activo' : 'Inactivo'}
              </p>
            </div>

            {/* Fecha de registro */}
            <div>
              <label className="text-quaternary text-sm font-medium block mb-1">
                Fecha de registro
              </label>
              <p className="text-white text-sm bg-tertiary border border-white/20 rounded-lg p-3">
                {formatDate(member.createdAt)}
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-quaternary text-sm font-medium block mb-1">
                  Rutinas creadas
                </label>
                <p className="text-white text-sm bg-tertiary border border-white/20 rounded-lg p-3 text-center">
                  {member.createdRoutines || 0}
                </p>
              </div>
              {/* <div>
                <label className="text-quaternary text-sm font-medium block mb-1">
                  Rutinas completadas
                </label>
                <p className="text-white text-sm bg-tertiary border border-white/20 rounded-lg p-3 text-center">
                  {member.completedRoutines || 0}
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <Button
            isWhite={true}
            action={onClose}
            isWidthFull={true}
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  )
}