import { useState, useEffect, useMemo } from "react"
import { LuSearch } from "react-icons/lu"
import { AdminTable, type Column } from "../../components/admin/AdminTable"
import { MemberDataModal } from "../../components/admin/Members/MemberDataModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { Spinner } from "../../components/Spinner"
import { Toast } from "../../components/Toast"
import { usuarioService } from "../../services/UsuarioService"
import type { UsuarioResponseDTO } from "../../types/usuario/UsuarioResponseDTO"
import { useAuth0 } from "@auth0/auth0-react"
import { AdminTableFilters } from "../../components/admin/AdminTableFilters"
import { useAdminTableFilters } from "../../hooks/useAdminTableFilters"

export const MembersAdminView = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<UsuarioResponseDTO | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState<UsuarioResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
  } = useAdminTableFilters(members)

  // Cargar usuarios
  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
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
      const [users] = await Promise.all([
        usuarioService.getAllUsers(token),
        new Promise(resolve => setTimeout(resolve, 600))
      ])
      setMembers(users)
    } catch (err: any) {
      console.error("Error al cargar usuarios:", err)
      setError(err.message || "Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  const handleViewMember = (member: UsuarioResponseDTO) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (memberId: number) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })

      await usuarioService.toggleUserActive(token, memberId)
      
      // Actualizar la lista local
      setMembers(prevMembers =>
        prevMembers.map(member =>
          member.id === memberId ? { ...member, active: !member.active } : member
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

  // Definición de columnas para AdminTable
  const columns: Column<UsuarioResponseDTO>[] = [
    {
      key: 'pictureUrl',
      label: 'Imagen',
      width: 'col-span-1',
      render: (member) => (
        <img
          src={member.pictureUrl || 'https://cdn.auth0.com/avatars/default.png'}
          alt={member.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      width: 'col-span-2',
      render: (member) => (
        <p className="text-white text-sm font-medium">{member.name}</p>
      )
    },
    {
      key: 'email',
      label: 'Correo electrónico',
      width: 'col-span-2',
      render: (member) => (
        <p className="text-quaternary text-sm">{member.email}</p>
      )
    },
    {
      key: 'active',
      label: 'Estado',
      width: 'col-span-1',
      render: (member) => (
        <button
          onClick={() => handleToggleStatus(member.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            member.active ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              member.active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: 'col-span-1',
      render: (member) => (
        <button
          onClick={() => handleViewMember(member)}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors cursor-pointer"
        >
          Ver
        </button>
      )
    }
  ]

  // Filtrar miembros por búsqueda
  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return filteredAndSorted
    return filteredAndSorted.filter(member =>
      member.name.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term)
    )
  }, [filteredAndSorted, searchTerm])

  // Paginación
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex)

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
              onClick={loadMembers}
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
        <div>
          <h1 className="text-white text-2xl font-semibold mb-2">Gestionar Usuarios</h1>
          <p className="text-quaternary text-sm">Administra los miembros del gimnasio</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Loading Spinner */}
        {loading ? (
          <Spinner size="lg" message="Cargando usuarios..." />
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
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          data={paginatedMembers}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredMembers.length}
          itemName="usuario"
          itemNamePlural="usuarios"
          emptyMessage={searchTerm ? `No se encontraron usuarios con "${searchTerm}"` : 'No hay usuarios registrados'}
        />
          </>
        )}
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