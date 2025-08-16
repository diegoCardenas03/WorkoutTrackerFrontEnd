import { IoClose } from "react-icons/io5"
import { Button } from "../../Button"

interface Member {
  id: string
  image: string
  name: string
  email: string
  country: string
  status: 'active' | 'inactive'
  joinDate: string
  lastAccess: string
}

interface MemberDataModalProps {
  isOpen: boolean
  onClose: () => void
  member: Member | null
}

export const MemberDataModal = ({
  isOpen,
  onClose,
  member
}: MemberDataModalProps) => {
  if (!isOpen || !member) return null

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
              src={member.image}
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

            {/* País */}
            <div>
              <label className="text-quaternary text-sm font-medium block mb-1">
                País
              </label>
              <p className="text-white text-sm bg-tertiary border border-white/20 rounded-lg p-3">
                {member.country}
              </p>
            </div>

            {/* Fecha de registro */}
            <div>
              <label className="text-quaternary text-sm font-medium block mb-1">
                Fecha de registro
              </label>
              <p className="text-white text-sm bg-tertiary border border-white/20 rounded-lg p-3">
                {member.joinDate}
              </p>
            </div>

            {/* Último acceso */}
            <div>
              <label className="text-quaternary text-sm font-medium block mb-1">
                Último acceso
              </label>
              <p className="text-white text-sm bg-tertiary border border-white/20 rounded-lg p-3">
                {member.lastAccess}
              </p>
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