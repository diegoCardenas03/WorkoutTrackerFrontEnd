import { useState } from "react"
import { LuPlus, LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Button } from "../../components/Button"
import { EmployeeModal } from "../../components/admin/Employees/EmployeeModal"
import image from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\benavides-geronimo.png"
import { AdminLayout } from "../../layouts/admin/AdminLayout"

interface Employee {
  id: string
  image: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

export const EmployeesAdminView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo
  const employees: Employee[] = [
    {
      id: "1",
      image: image,
      name: "Geronimo Hernandez",
      email: "geronimo@gmail.com",
      role: "Administrador",
      status: "inactive"
    },
    {
      id: "2", 
      image: image,
      name: "Geronimo Hernandez",
      email: "geronimo@gmail.com",
      role: "Empleado",
      status: "active"
    },
    {
      id: "3",
      image: image, 
      name: "Geronimo Hernandez",
      email: "geronimo@gmail.com",
      role: "Empleado",
      status: "active"
    }
  ]

  const handleCreateEmployee = () => {
    setEditingEmployee(null)
    setIsModalOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (employeeId: string) => {
    console.log("Toggle status for employee:", employeeId)
    // Aquí iría la lógica para cambiar el estado
  }

  const handleSaveEmployee = (employeeData: any) => {
    console.log("Save employee:", employeeData)
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  return (
    <AdminLayout>
    <div className="flex-1 bg-primary">
      {/* Header */}
      <div className="bg-tertiary border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-semibold mb-2">Gestionar Empleados</h1>
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
            {employees.map((employee) => (
              <div key={employee.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                {/* Image */}
                <div>
                  <img
                    src={employee.image}
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
                  <p className="text-white text-sm">{employee.role}</p>
                </div>

                {/* Status Toggle */}
                <div>
                  <button
                    onClick={() => handleToggleStatus(employee.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        employee.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div>
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LuChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-white text-black text-sm font-medium">
              1
            </button>
            <button className="w-8 h-8 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white text-sm transition-colors">
              2
            </button>
          </div>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-2 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white transition-colors"
          >
            <LuChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEmployee(null)
        }}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
    </AdminLayout>
  )
}