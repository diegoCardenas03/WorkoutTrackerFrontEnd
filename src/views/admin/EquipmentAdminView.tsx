import { useEffect, useMemo, useState } from "react"
import { LuPlus, LuSearch, LuChevronLeft, LuChevronRight, LuTrash2 } from "react-icons/lu"
import { Button } from "../../components/Button"
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

interface Equipment {
  id: string
  name: string
  active: boolean
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

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return equipments
    return equipments.filter((e) => e.name.toLowerCase().includes(term))
  }, [equipments, searchTerm])

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

  const handleSaveEquipment = async (equipmentData: { name: string; active: boolean }) => {
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

      console.log('🔑 [EquipmentAdminView] Token obtenido');

      if (editingEquipment) {
        console.log('🔄 [EquipmentAdminView] Actualizando equipamiento...');
        const result = await (dispatch as any)(updateEquipment({ 
          token, 
          id: Number(editingEquipment.id), 
          data: payload 
        }))
        
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [EquipmentAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al actualizar equipamiento');
        }
        
        console.log('✅ [EquipmentAdminView] Equipamiento actualizado exitosamente');
        setToast({ msg: 'Equipamiento actualizado exitosamente', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      } else {
        console.log('🚀 [EquipmentAdminView] Llamando a createEquipment...');
        const result = await (dispatch as any)(createEquipment({ token, data: payload }))
        
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [EquipmentAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al crear equipamiento');
        }
        
        console.log('✅ [EquipmentAdminView] Equipamiento creado exitosamente');
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
          <div className="bg-tertiary rounded-lg border border-white/20 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/10 bg-itemsCard">
              <div className="text-quaternary text-sm font-medium col-span-2">Nombre</div>
              <div className="text-quaternary text-sm font-medium">Estado</div>
              <div className="text-quaternary text-sm font-medium">Acciones</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/10">
              {paginated.length === 0 && (
                <div className="p-6 text-quaternary text-sm">No hay equipamiento para mostrar.</div>
              )}
              {paginated.map((equipment) => (
                <div key={equipment.id} className="grid grid-cols-4 gap-4 p-4 items-center">
                  {/* Name */}
                  <div className="col-span-2">
                    <p className="text-white text-sm font-medium">{equipment.name}</p>
                  </div>

                  {/* Status Toggle */}
                  <div>
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
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditEquipment({
                        id: String(equipment.id),
                        name: equipment.name,
                        active: equipment.active,
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
                </div>
              ))}
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
          {filtered.length > 0 && (
            <div className="text-center mt-4">
              <p className="text-quaternary text-sm">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filtered.length)} de {filtered.length} equipamiento{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
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
