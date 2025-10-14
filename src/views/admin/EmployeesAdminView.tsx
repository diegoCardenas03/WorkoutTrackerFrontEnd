import { useState, useEffect, useMemo } from "react"
import { LuPlus, LuSearch, LuPencil } from "react-icons/lu"
import { Button } from "../../components/Button"
import { AdminTable, type Column } from "../../components/admin/AdminTable"
import { EmployeeModal } from "../../components/admin/Employees/EmployeeModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { Spinner } from "../../components/Spinner"
import { Toast } from "../../components/Toast"
import { usuarioService } from "../../services/UsuarioService"
import type { UsuarioResponseDTO } from "../../types/usuario/UsuarioResponseDTO"
import type { SignupRequestDTO } from "../../types/usuario/auth0/SignupRequestDTO"
import { useAuth0 } from "@auth0/auth0-react"
import { useUser } from "../../hooks/useUser"
import { AdminTableFilters } from "../../components/admin/AdminTableFilters"
import { useAdminTableFilters } from "../../hooks/useAdminTableFilters"

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
  
  // Hook de filtros
  const {
    activeFilter,
    setActiveFilter,
    dateFilter,
    setDateFilter,
    sortOrder,
    setSortOrder,
    filteredAndSorted,
    clearFilters,
    hasActiveFilters
  } = useAdminTableFilters(employees)

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

  // Definición de columnas para AdminTable
  const columns: Column<UsuarioResponseDTO>[] = [
    {
      key: 'pictureUrl',
      label: 'Imagen',
      width: 'col-span-1',
      render: (employee) => (
        <img
          src={employee.pictureUrl || 'https://cdn.auth0.com/avatars/default.png'}
          alt={employee.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      width: 'col-span-2',
      render: (employee) => (
        <p className="text-white text-sm font-medium">{employee.name}</p>
      )
    },
    {
      key: 'email',
      label: 'Correo electrónico',
      width: 'col-span-2',
      render: (employee) => (
        <p className="text-quaternary text-sm">{employee.email}</p>
      )
    },
    {
      key: 'role',
      label: 'Rol',
      width: 'col-span-1',
      render: (employee) => (
        <p className="text-white text-sm capitalize">{employee.role?.name || 'Admin'}</p>
      )
    },
    {
      key: 'active',
      label: 'Estado',
      width: 'col-span-1',
      render: (employee) => (
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
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: 'col-span-1',
      render: (employee) => (
        <button
          onClick={() => handleEditEmployee(employee)}
          className="p-2 rounded-lg bg-itemsCard border border-white/20 text-quaternary hover:text-white hover:border-white/40 transition-colors"
          title="Editar empleado"
        >
          <LuPencil size={16} />
        </button>
      )
    }
  ]

  // Filtrar empleados por búsqueda
  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return filteredAndSorted
    return filteredAndSorted.filter(employee =>
      employee.name.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term)
    )
  }, [filteredAndSorted, searchTerm])

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
            {/* Filtros */}
            <AdminTableFilters
              config={{
                showActiveFilter: true,
                showDateFilters: true
              }}
              activeFilter={activeFilter}
              onActiveFilterChange={setActiveFilter}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

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
        <AdminTable
          columns={columns}
          data={paginatedEmployees}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredEmployees.length}
          itemName="empleado"
          itemNamePlural="empleados"
          emptyMessage={searchTerm ? `No se encontraron empleados con "${searchTerm}"` : 'No hay empleados registrados'}
        />
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