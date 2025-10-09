import { useState, useEffect } from "react"
import { IoClose } from "react-icons/io5"
import { LuEye, LuEyeOff } from "react-icons/lu"
import { Button } from "../../Button"
import type { SignupRequestDTO } from "../../../types/usuario/auth0/SignupRequestDTO"
import type { UsuarioResponseDTO } from "../../../types/usuario/UsuarioResponseDTO"

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (employeeData: SignupRequestDTO) => void
  isSaving?: boolean
  employee?: UsuarioResponseDTO | null
}

export const EmployeeModal = ({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
  employee = null
}: EmployeeModalProps) => {
  const [formData, setFormData] = useState<SignupRequestDTO>({
    name: "",
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isOpen && employee) {
      // Cargar datos del empleado para editar
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        password: "" // La contraseña se deja vacía al editar
      })
    } else if (!isOpen) {
      // Reset form cuando se cierra el modal
      setFormData({
        name: "",
        email: "",
        password: ""
      })
      setErrors({
        name: "",
        email: "",
        password: ""
      })
    }
  }, [isOpen, employee])

  const handleInputChange = (field: keyof SignupRequestDTO, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      email: "",
      password: ""
    }

    if (!formData.name?.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.email?.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    // La contraseña solo es obligatoria al crear (no al editar)
    if (!employee) {
      if (!formData.password?.trim()) {
        newErrors.password = "La contraseña es obligatoria"
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres"
      }
    } else {
      // Al editar, si se ingresa contraseña, debe ser válida
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres"
      }
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.email && !newErrors.password
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
    }
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
            {employee ? 'Editar Administrador' : 'Crear Administrador'}
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
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ingresa el nombre completo"
              disabled={isSaving}
              className={`w-full p-3 bg-tertiary border rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.name ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
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
              disabled={isSaving || !!employee}
              className={`w-full p-3 bg-tertiary border rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
            {employee && (
              <p className="text-quaternary text-xs mt-1">
                El email no puede ser modificado
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Contraseña {employee && '(Opcional)'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={employee ? "Dejar vacío para no cambiar" : "Ingresa la contraseña (mínimo 8 caracteres)"}
                disabled={isSaving}
                className={`w-full p-3 pr-12 bg-tertiary border rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.password ? 'border-red-500' : 'border-white/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSaving}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-quaternary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <p className="text-quaternary text-xs mt-1">
              {employee ? 'Dejar en blanco si no deseas cambiar la contraseña' : 'Mínimo 8 caracteres'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-white/10">
          <Button
            isWhite={false}
            action={handleCancel}
            isWidthFull={true}
            isBlocked={isSaving}
          >
            Cancelar
          </Button>
          <Button
            isWhite={true}
            action={handleSave}
            isWidthFull={true}
            isBlocked={isSaving}
          >
            {isSaving 
              ? (employee ? 'Guardando...' : 'Creando...') 
              : (employee ? 'Guardar Cambios' : 'Crear Administrador')
            }
          </Button>
        </div>
      </div>
    </div>
  )
}