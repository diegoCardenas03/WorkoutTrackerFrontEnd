import { useEffect, useMemo, useState } from "react"
import { LuPlus, LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Button } from "../../components/Button"
import { MuscleZoneAdminModal } from "../../components/admin/MuscleZones/MuscleZoneAdminModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { fetchMuscleZones, createMuscleZone, updateMuscleZone, toggleMuscleZoneActive } from "../../store/slices/muscleZoneSlice"
import type { ZonaMuscularRequestDTO } from "../../types/zonaMuscular/ZonaMuscularRequestDTO"
import { Toast } from "../../components/Toast"
import { Spinner } from "../../components/Spinner"
import { useAuth0 } from "@auth0/auth0-react"
import { AdminTableFilters } from "../../components/admin/AdminTableFilters"
import { useAdminTableFilters } from "../../hooks/useAdminTableFilters"

interface MuscleZone {
  id: string
  name: string
  active: boolean
  imageUrl?: string
}

export const MuscleZonesAdminView = () => {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const { muscleZones, loading } = useSelector((s: RootState) => s.muscleZones)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMuscleZone, setEditingMuscleZone] = useState<MuscleZone | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

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
  } = useAdminTableFilters(muscleZones)

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        })
        ;(dispatch as any)(fetchMuscleZones(token))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [dispatch, getAccessTokenSilently])

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return filteredAndSorted
    return filteredAndSorted.filter((z) => z.name.toLowerCase().includes(term))
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

  const handleCreateMuscleZone = () => {
    setEditingMuscleZone(null)
    setIsModalOpen(true)
  }

  const handleEditMuscleZone = (muscleZone: MuscleZone) => {
    setEditingMuscleZone(muscleZone)
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
      await (dispatch as any)(toggleMuscleZoneActive({ token, id }))
      setToast({ 
        msg: `Zona muscular ${currentStatus ? 'desactivada' : 'activada'} exitosamente`, 
        type: 'success' 
      })
      setTimeout(() => setToast(null), 3000)
    } catch (error) {
      console.error('Error toggling muscle zone status:', error)
      setToast({ msg: 'Error al cambiar el estado de la zona muscular', type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const handleSaveMuscleZone = async (muscleZoneData: { name: string; active: boolean }, image?: File) => {
    const payload: ZonaMuscularRequestDTO = {
      name: muscleZoneData.name,
      active: muscleZoneData.active,
    }

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })

      // console.log('🔑 [MuscleZonesAdminView] Token obtenido');
      
      // 🔍 DEBUG: Decodificar el token para ver los roles
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        // console.log('🔍 [DEBUG] Token payload completo:', payload);
        // console.log('🔍 [DEBUG] Roles en el token:', payload[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]);
        // console.log('🔍 [DEBUG] ¿Tiene rol ADMIN?', payload[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`]?.includes('ADMIN'));
      } catch (e) {
        console.error('❌ Error al decodificar token:', e);
      }

      if (editingMuscleZone) {
        // console.log('🔄 [MuscleZonesAdminView] Actualizando zona muscular...');
        const result = await (dispatch as any)(updateMuscleZone({ 
          token, 
          id: Number(editingMuscleZone.id), 
          data: payload,
          image 
        }))
        
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [MuscleZonesAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al actualizar zona muscular');
        }
        
        // console.log('✅ [MuscleZonesAdminView] Zona muscular actualizada exitosamente');
        setToast({ msg: 'Zona muscular actualizada exitosamente', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      } else {
        // console.log('🚀 [MuscleZonesAdminView] Llamando a createMuscleZone...');
        const result = await (dispatch as any)(createMuscleZone({ token, data: payload, image }))
        
        // Verificar si la acción fue rechazada
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [MuscleZonesAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al crear zona muscular');
        }
        
        // console.log('✅ [MuscleZonesAdminView] Zona muscular creada exitosamente');
        setToast({ msg: 'Zona muscular creada exitosamente', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      }
      
      setIsModalOpen(false)
      setEditingMuscleZone(null)
      ;(dispatch as any)(fetchMuscleZones(token))
    } catch (e: any) {
      console.error('❌ [MuscleZonesAdminView] Error al guardar zona muscular:', e)
      
      // Mensajes de error específicos según el tipo
      let errorMessage = 'Error al guardar zona muscular';
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
              <h1 className="text-white text-2xl font-semibold mb-2">Gestionar Zonas Musculares</h1>
              <p className="text-quaternary text-sm">Administra las zonas musculares principales</p>
            </div>

            <Button
              icon={<LuPlus size={16} />}
              iconPosition={false}
              isWhite={true}
              action={handleCreateMuscleZone}
            >
              Crear Zona Muscular
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading Spinner */}
          {loading ? (
            <Spinner size="lg" message="Cargando zonas musculares..." />
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
                placeholder="Buscar zona muscular..."
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
                <div className="p-6 text-quaternary text-sm">No hay zonas musculares para mostrar.</div>
              )}
              {paginated.map((zone) => (
                <div key={zone.id} className="grid grid-cols-4 gap-4 p-4 items-center">
                  {/* Name */}
                  <div className="col-span-2">
                    <p className="text-white text-sm font-medium">{zone.name}</p>
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <button
                      onClick={() => handleToggleActive(zone.id, zone.active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        zone.active
                          ? 'border-green-500 text-green-400 hover:bg-green-500/10'
                          : 'border-red-500 text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      {zone.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditMuscleZone({
                        id: String(zone.id),
                        name: zone.name,
                        active: zone.active,
                        imageUrl: zone.imageUrl,
                      })}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Editar
                    </button>
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
                Mostrando {startIndex + 1} - {Math.min(endIndex, filtered.length)} de {filtered.length} zona{filtered.length !== 1 ? 's' : ''} muscular{filtered.length !== 1 ? 'es' : ''}
              </p>
            </div>
          )}
            </>
          )}
        </div>

        {/* Modal */}
        <MuscleZoneAdminModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingMuscleZone(null)
          }}
          muscleZone={editingMuscleZone}
          onSave={handleSaveMuscleZone}
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
