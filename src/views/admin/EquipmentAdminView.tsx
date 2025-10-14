import { useEffect, useMemo, useState } from "react"
import { LuPlus, LuSearch, LuTrash2 } from "react-icons/lu"
import { Button } from "../../components/Button"
import { AdminTable, type Column } from "../../components/admin/AdminTable"
import { EquipmentAdminModal } from "../../components/admin/Equipment/EquipmentAdminModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { 
  fetchEquipments, 
  createEquipment,
  updateEquipment, 
  toggleEquipmentActive,
  hardDeleteEquipment 
} from "../../store/slices/equipmentSlice"
import type { EquipamientoRequestDTO } from "../../types/equipamiento/EquipamientoRequestDTO"
import { Toast } from "../../components/Toast"
import { Spinner } from "../../components/Spinner"
import { useAuth0 } from "@auth0/auth0-react"
import { AdminTableFilters } from "../../components/admin/AdminTableFilters"
import { useAdminTableFilters } from "../../hooks/useAdminTableFilters"

interface Equipment {
  id: string
  name: string
  active: boolean
  imageUrl?: string
}

export const EquipmentAdminView = () => {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const { equipments, loading } = useSelector((s: RootState) => s.equipments)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

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
  } = useAdminTableFilters(equipments)

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        })
        ;(dispatch as any)(fetchEquipments(token))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [dispatch, getAccessTokenSilently])

  // Definición de columnas para AdminTable
  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'Nombre',
      width: 'col-span-2',
      render: (equipment) => (
        <p className="text-white text-sm font-medium">{equipment.name}</p>
      )
    },
    {
      key: 'active',
      label: 'Estado',
      width: 'col-span-1',
      render: (equipment) => (
        <button
          onClick={() => handleToggleActive(equipment.id, equipment.active)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            equipment.active
              ? 'border-green-500 text-green-400 hover:bg-green-500/10'
              : 'border-red-500 text-red-400 hover:bg-red-500/10'
          }`}
        >
          {equipment.active ? 'Activo' : 'Inactivo'}
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: 'col-span-1',
      render: (equipment) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleEditEquipment({
              id: String(equipment.id),
              name: equipment.name,
              active: equipment.active,
              imageUrl: equipment.imageUrl,
            })}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Editar
          </button>
          
          {showDeleteConfirm === equipment.id ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDeleteEquipment(equipment.id)}
                className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="text-quaternary hover:text-white text-xs font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(equipment.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Eliminar permanentemente"
            >
              <LuTrash2 size={16} />
            </button>
          )}
        </div>
      )
    }
  ]

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return filteredAndSorted
    return filteredAndSorted.filter((e) => e.name.toLowerCase().includes(term))
  }, [filteredAndSorted, searchTerm])

  // Paginación
  const itemsPerPage = 10
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginated = filtered.slice(startIndex, endIndex)

  // Reset a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleCreateEquipment = () => {
    setEditingEquipment(null)
    setIsModalOpen(true)
  }

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment)
    setIsModalOpen(true)
  }

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })
      await (dispatch as any)(toggleEquipmentActive({ token, id }))
      setToast({ 
        msg: `Equipamiento ${currentStatus ? 'desactivado' : 'activado'} exitosamente`, 
        type: 'success' 
      })
      setTimeout(() => setToast(null), 3000)
    } catch (error) {
      console.error('Error toggling equipment status:', error)
      setToast({ msg: 'Error al cambiar el estado del equipamiento', type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const handleDeleteEquipment = async (id: number) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })
      
      const result = await (dispatch as any)(hardDeleteEquipment({ token, id }))
      
      if (result.type.endsWith('/rejected')) {
        throw new Error(result.payload || 'Error al eliminar equipamiento')
      }
      
      setToast({ msg: 'Equipamiento eliminado permanentemente', type: 'success' })
      setTimeout(() => setToast(null), 3000)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting equipment:', error)
      setToast({ msg: 'Error al eliminar equipamiento', type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const handleSaveEquipment = async (equipmentData: { name: string; active: boolean }, image?: File) => {
    const payload: EquipamientoRequestDTO = {
      name: equipmentData.name,
      active: equipmentData.active,
    }

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })

      // console.log('🔑 [EquipmentAdminView] Token obtenido');

      if (editingEquipment) {
        // console.log('🔄 [EquipmentAdminView] Actualizando equipamiento...');
        const result = await (dispatch as any)(updateEquipment({ 
          token, 
          id: Number(editingEquipment.id), 
          data: payload,
          image 
        }))
        
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [EquipmentAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al actualizar equipamiento');
        }
        
        // console.log('✅ [EquipmentAdminView] Equipamiento actualizado exitosamente');
        setToast({ msg: 'Equipamiento actualizado exitosamente', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      } else {
        // console.log('🚀 [EquipmentAdminView] Llamando a createEquipment...');
        const result = await (dispatch as any)(createEquipment({ token, data: payload, image }))
        
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [EquipmentAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al crear equipamiento');
        }
        
        // console.log('✅ [EquipmentAdminView] Equipamiento creado exitosamente');
        setToast({ msg: 'Equipamiento creado exitosamente', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      }
      
      setIsModalOpen(false)
      setEditingEquipment(null)
      ;(dispatch as any)(fetchEquipments(token))
    } catch (e: any) {
      console.error('❌ [EquipmentAdminView] Error al guardar equipamiento:', e)
      
      let errorMessage = 'Error al guardar equipamiento';
      if (e?.message?.includes('403') || e?.message?.includes('Forbidden')) {
        errorMessage = 'No tienes permisos de administrador. Verifica tu rol en Auth0.';
      } else if (e?.message?.includes('401') || e?.message?.includes('Unauthorized')) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      setToast({ msg: errorMessage, type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  return (
    <AdminLayout>
      <div className="flex-1 bg-primary">
        {/* Header */}
        <div className="bg-tertiary border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-semibold mb-2">Gestionar Equipamiento</h1>
              <p className="text-quaternary text-sm">Administra el equipamiento disponible para ejercicios</p>
            </div>

            <Button
              icon={<LuPlus size={16} />}
              iconPosition={false}
              isWhite={true}
              action={handleCreateEquipment}
            >
              Crear Equipamiento
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading Spinner */}
          {loading ? (
            <Spinner size="lg" message="Cargando equipamiento..." />
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
                placeholder="Buscar equipamiento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Table */}
          <AdminTable
            columns={columns}
            data={paginated}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filtered.length}
            itemName="equipamiento"
          />
            </>
          )}
        </div>

        {/* Modal */}
        <EquipmentAdminModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingEquipment(null)
          }}
          equipment={editingEquipment}
          onSave={handleSaveEquipment}
        />
        
        <Toast
          open={!!toast}
          type={toast?.type}
          message={toast?.msg || ''}
          onClose={() => setToast(null)}
          durationMs={toast?.type === 'error' ? 4000 : 3000}
        />
      </div>
    </AdminLayout>
  )
}
