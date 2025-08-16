import { useState, useEffect } from "react"
import { IoClose } from "react-icons/io5"
import { Button } from "../../Button"

interface Employee {
  id: string
  image: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  employee?: Employee | null
  onSave: (employeeData: any) => void
}

export const EmployeeModal = ({
  isOpen,
  onClose,
  employee,
  onSave
}: EmployeeModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: ""
  })

  const isEditing = !!employee

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        password: ""
      })
    } else {
      setFormData({
        name: "",
        email: "",
        role: "",
        password: ""
      })
    }
  }, [employee])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen) return null

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
            {isEditing ? "Editar Empleado" : "Crear Empleado"}
          </h2>
          <button 
            onClick={onClose}
            className="text-quaternary hover:text-white transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Nombre Completo */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ingresa el nombre completo"
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Ingresa el email"
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Rol
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            >
              <option value="" disabled className="bg-tertiary">
                Selecciona un rol
              </option>
              <option value="Administrador" className="bg-tertiary">
                Administrador
              </option>
              <option value="Empleado" className="bg-tertiary">
                Empleado
              </option>
            </select>
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={isEditing ? "Dejar vacío para mantener actual" : "Ingresa la contraseña"}
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-white/10">
          <Button
            isWhite={false}
            action={handleCancel}
            isWidthFull={true}
          >
            Cancelar
          </Button>
          <Button
            isWhite={true}
            action={handleSave}
            isWidthFull={true}
          >
            {isEditing ? "Guardar Cambios" : "Crear Empleado"}
          </Button>
        </div>
      </div>
    </div>
  )
}