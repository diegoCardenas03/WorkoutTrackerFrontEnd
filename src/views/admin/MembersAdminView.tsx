import { useState } from "react"
import { LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { MemberDataModal } from "../../components/admin/Members/MemberDataModal"
import image from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\benavides-geronimo.png"
import { AdminLayout } from "../../layouts/admin/AdminLayout"

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

export const MembersAdminView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo
  const members: Member[] = [
    {
      id: "1",
      image: image,
      name: "Geronimo Hernandez",
      email: "geronimo@gmail.com",
      country: "Argentina",
      status: "active",
      joinDate: "26 de Marzo de 2025",
      lastAccess: "11 de Julio de 2025, 13:02"
    },
    {
      id: "2",
      image: image, 
      name: "Geronimo Hernandez",
      email: "geronimo@gmail.com",
      country: "Chile",
      status: "active",
      joinDate: "26 de Marzo de 2025",
      lastAccess: "11 de Julio de 2025, 13:02"
    },
    {
      id: "3",
      image: image,
      name: "Geronimo Hernandez", 
      email: "geronimo@gmail.com",
      country: "Uruguay",
      status: "inactive",
      joinDate: "26 de Marzo de 2025",
      lastAccess: "11 de Julio de 2025, 13:02"
    }
  ]

  const handleViewMember = (member: Member) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (memberId: string) => {
    console.log("Toggle status for member:", memberId)
    // Aquí iría la lógica para cambiar el estado
  }

  return (
    <AdminLayout>
    <div className="flex-1 bg-primary">
      {/* Header */}
      <div className="bg-tertiary border-b border-white/10 p-6">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-2">Gestionar Usuarios</h1>
          <p className="text-quaternary text-sm">Administra los miembros del gimnasio</p>
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
              placeholder="Buscar usuario..."
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
            <div className="text-quaternary text-sm font-medium">País</div>
            <div className="text-quaternary text-sm font-medium">Estado</div>
            <div className="text-quaternary text-sm font-medium">Acciones</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {members.map((member) => (
              <div key={member.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                {/* Image */}
                <div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                {/* Name */}
                <div>
                  <p className="text-white text-sm font-medium">{member.name}</p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-quaternary text-sm">{member.email}</p>
                </div>

                {/* Country */}
                <div>
                  <p className="text-white text-sm">{member.country}</p>
                </div>

                {/* Status Toggle */}
                <div>
                  <button
                    onClick={() => handleToggleStatus(member.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      member.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        member.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div>
                  <button
                    onClick={() => handleViewMember(member)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Ver
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
      <MemberDataModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedMember(null)
        }}
        member={selectedMember}
      />
    </div>
    </AdminLayout>
  )
}