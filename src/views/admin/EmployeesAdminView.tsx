import { useState, useEffect } from "react"
import { LuPlus, LuSearch, LuChevronLeft, LuChevronRight, LuPencil } from "react-icons/lu"
import { Button } from "../../components/Button"
import { EmployeeModal } from "../../components/admin/Employees/EmployeeModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { Spinner } from "../../components/Spinner"
import { Toast } from "../../components/Toast"
import { usuarioService } from "../../services/UsuarioService"
import type { UsuarioResponseDTO } from "../../types/usuario/UsuarioResponseDTO"
import type { SignupRequestDTO } from "../../types/usuario/auth0/SignupRequestDTO"
import { useAuth0 } from "@auth0/auth0-react"
import { useUser } from "../../hooks/useUser"

export const EmployeesAdminView = () => {
  const { getAccessTokenSilently } = useAuth0()
  const { userData: currentUser } = useUser() // Usuario actual logueado
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<UsuarioResponseDTO | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<UsuarioResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Cargar empleados/admins
  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })

      // Delay mínimo para mejor UX del spinner
      const [admins] = await Promise.all([
        usuarioService.getAllAdmins(token),
        new Promise(resolve => setTimeout(resolve, 600))
      ])
      setEmployees(admins)
    } catch (err: any) {
      console.error("Error al cargar empleados:", err)
      setError(err.message || "Error al cargar empleados")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmployee = () => {
    setEditingEmployee(null)
    setIsModalOpen(true)
  }

  const handleEditEmployee = (employee: UsuarioResponseDTO) => {
    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (employeeId: number) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })

      await usuarioService.toggleUserActive(token, employeeId)
      
      // Actualizar la lista local
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.id === employeeId ? { ...emp, active: !emp.active } : emp
        )
      )

      setToastMessage("Estado actualizado correctamente")
      setShowSuccessToast(true)
    } catch (err: any) {
      console.error("Error al cambiar estado:", err)
      setToastMessage(err.message || "Error al cambiar estado")
      setShowErrorToast(true)
    }
  }

  const handleSaveEmployee = async (employeeData: SignupRequestDTO) => {
    try {
      setIsSaving(true)
      
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })

      if (editingEmployee) {
        // Editar empleado existente
        // TODO: Implementar cuando el backend tenga el endpoint
        // await usuarioService.updateAdmin(token, editingEmployee.id, employeeData)
        console.log('Editar empleado:', editingEmployee.id, employeeData)
        setToastMessage("Funcionalidad de edición pendiente en el backend")
        setShowErrorToast(true)
      } else {
        // Crear nuevo empleado
        await usuarioService.registerAdmin(token, employeeData)
        setToastMessage("Administrador creado exitosamente")
        setShowSuccessToast(true)
        setIsModalOpen(false)
        
        // Recargar la lista
        loadEmployees()
      }
    } catch (err: any) {
      console.error("Error al guardar administrador:", err)
      setToastMessage(err.message || "Error al guardar administrador")
      setShowErrorToast(true)
    } finally {
      setIsSaving(false)
    }
  }

  // Filtrar empleados por búsqueda
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Paginación
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex)

  // Reset a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])



  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen bg-primary">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={loadEmployees}
              className="mt-4 px-4 py-2 bg-quaternary text-white rounded-lg hover:bg-quaternary/80"
            >
              Reintentar
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
    <div className="flex-1 bg-primary">
      {/* Header */}
      <div className="bg-tertiary border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-semibold mb-2">Gestionar administradores</h1>
            <p className="text-quaternary text-sm">Administra el personal del gimnasio</p>
          </div>
          
          <Button
            icon={<LuPlus size={16} />}
            iconPosition={false}
            isWhite={true}
            action={handleCreateEmployee}
          >
            Crear Empleado
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Loading Spinner */}
        {loading ? (
          <Spinner size="lg" message="Cargando empleados..." />
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
          <div className="relative max-w-md">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quaternary" size={20} />
            <input
              type="text"
              placeholder="Buscar empleado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-tertiary rounded-lg border border-white/20 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 bg-itemsCard">
            <div className="text-quaternary text-sm font-medium">Imagen</div>
            <div className="text-quaternary text-sm font-medium">Nombre</div>
            <div className="text-quaternary text-sm font-medium">Correo electrónico</div>
            <div className="text-quaternary text-sm font-medium">Rol</div>
            <div className="text-quaternary text-sm font-medium">Estado</div>
            <div className="text-quaternary text-sm font-medium">Acciones</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((employee) => (
                <div key={employee.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                  {/* Image */}
                  <div>
                    <img
                      src={employee.picture || 'https://cdn.auth0.com/avatars/default.png'}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <p className="text-white text-sm font-medium">{employee.name}</p>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-quaternary text-sm">{employee.email}</p>
                  </div>

                  {/* Role */}
                  <div>
                    <p className="text-white text-sm capitalize">{employee.role?.name || 'Admin'}</p>
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <button
                      onClick={() => handleToggleStatus(employee.id)}
                      disabled={currentUser?.id === employee.id}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        employee.active ? 'bg-green-500' : 'bg-red-500'
                      } ${currentUser?.id === employee.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={currentUser?.id === employee.id ? 'No puedes desactivar tu propio usuario' : ''}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          employee.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div>
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="p-2 rounded-lg bg-itemsCard border border-white/20 text-quaternary hover:text-white hover:border-white/40 transition-colors"
                      title="Editar empleado"
                    >
                      <LuPencil size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-quaternary">
                  {searchTerm ? `No se encontraron empleados con "${searchTerm}"` : 'No hay empleados registrados'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LuChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-white text-black'
                      : 'bg-tertiary border border-white/20 text-quaternary hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Info de paginación */}
        {filteredEmployees.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-quaternary text-sm">
              Mostrando {startIndex + 1} - {Math.min(endIndex, filteredEmployees.length)} de {filteredEmployees.length} empleado{filteredEmployees.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
          </>
        )}
      </div>

      {/* Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEmployee(null)
        }}
        onSave={handleSaveEmployee}
        isSaving={isSaving}
        employee={editingEmployee}
      />

      {/* Toasts */}
      <Toast
        open={showSuccessToast}
        type="success"
        message={toastMessage}
        onClose={() => setShowSuccessToast(false)}
        durationMs={3000}
      />
      <Toast
        open={showErrorToast}
        type="error"
        message={toastMessage}
        onClose={() => setShowErrorToast(false)}
        durationMs={4000}
      />
    </div>
    </AdminLayout>
  )
}