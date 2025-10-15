import { useEffect, useMemo, useState } from "react"
import { LuPlus, LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Button } from "../../components/Button"
import { MuscleAdminModal } from "../../components/admin/Muscles/MuscleAdminModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { fetchMuscles, createMuscle, updateMuscle, toggleMuscleActive } from "../../store/slices/muscleSlice"
import { fetchMuscleZones } from "../../store/slices/muscleZoneSlice"
import type { MusculoRequestDTO } from "../../types/musculo/MusculoRequestDTO"
import { Toast } from "../../components/Toast"
import { Spinner } from "../../components/Spinner"
import { useAuth0 } from "@auth0/auth0-react"
import { AdminTableFilters } from "../../components/admin/AdminTableFilters"
import { useAdminTableFilters } from "../../hooks/useAdminTableFilters"

interface Muscle {
  id: string
  name: string
  muscleGroupId: number
  muscleGroupName: string
  active: boolean
  imageUrl?: string
}

export const MusclesAdminView = () => {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const { muscles, loading } = useSelector((s: RootState) => s.muscles)
  const { muscleZones } = useSelector((s: RootState) => s.muscleZones)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMuscle, setEditingMuscle] = useState<Muscle | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string>('all')
  
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
  } = useAdminTableFilters(muscles)

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        })
        ;(dispatch as any)(fetchMuscles(token))
        ;(dispatch as any)(fetchMuscleZones(token))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [dispatch, getAccessTokenSilently])

  const filtered = useMemo(() => {
    let result = filteredAndSorted
    
    // Filtro por grupo muscular
    if (muscleGroupFilter !== 'all') {
      result = result.filter((m) => 
        m.muscleGroup?.name?.toLowerCase() === muscleGroupFilter.toLowerCase()
      )
    }
    
    // Filtro por búsqueda
    const term = searchTerm.trim().toLowerCase()
    if (term) {
      result = result.filter((m) =>
        m.name.toLowerCase().includes(term) || 
        m.muscleGroup?.name?.toLowerCase().includes(term)
      )
    }
    
    return result
  }, [filteredAndSorted, searchTerm, muscleGroupFilter])

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

  const handleCreateMuscle = () => {
    setEditingMuscle(null)
    setIsModalOpen(true)
  }

  const handleEditMuscle = (muscle: Muscle) => {
    setEditingMuscle(muscle)
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
      await (dispatch as any)(toggleMuscleActive({ token, id }))
      setToast({ 
        msg: `Músculo ${currentStatus ? 'desactivado' : 'activado'} exitosamente`, 
        type: 'success' 
      })
      setTimeout(() => setToast(null), 3000)
    } catch (error) {
      console.error('Error toggling muscle status:', error)
      setToast({ msg: 'Error al cambiar el estado del músculo', type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const handleSaveMuscle = async (muscleData: { name: string; muscleGroupId: number; active: boolean }, image?: File) => {
    const payload: MusculoRequestDTO = {
      name: muscleData.name,
      muscleGroupId: muscleData.muscleGroupId,
      active: muscleData.active,
    }

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })

      // console.log('🔑 [MusclesAdminView] Token obtenido, procediendo a guardar...');

      if (editingMuscle) {
        // console.log('🔄 [MusclesAdminView] Actualizando músculo...');
        const result = await (dispatch as any)(updateMuscle({ 
          token, 
          id: Number(editingMuscle.id), 
          data: payload,
          image
        }))
        
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [MusclesAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al actualizar músculo');
        }
        
        // console.log('✅ [MusclesAdminView] Músculo actualizado exitosamente');
        setToast({ msg: 'Músculo actualizado exitosamente', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      } else {
        // console.log('🚀 [MusclesAdminView] Llamando a createMuscle...');
        const result = await (dispatch as any)(createMuscle({ token, data: payload, image }))
        
        // Verificar si la acción fue rechazada
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [MusclesAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al crear músculo');
        }
        
        // console.log('✅ [MusclesAdminView] Músculo creado exitosamente');
        setToast({ msg: 'Músculo creado exitosamente', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      }
      
      setIsModalOpen(false)
      setEditingMuscle(null)
      ;(dispatch as any)(fetchMuscles(token))
    } catch (e: any) {
      console.error('❌ [MusclesAdminView] Error al guardar músculo:', e)
      
      // Mensajes de error específicos según el tipo
      let errorMessage = 'Error al guardar músculo';
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
              <h1 className="text-white text-2xl font-semibold mb-2">Gestionar Músculos</h1>
              <p className="text-quaternary text-sm">Administra la biblioteca de músculos</p>
            </div>

            <Button
              icon={<LuPlus size={16} />}
              iconPosition={false}
              isWhite={true}
              action={handleCreateMuscle}
            >
              Crear Músculo
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading Spinner */}
          {loading ? (
            <Spinner size="lg" message="Cargando músculos..." />
          ) : (
            <>
              {/* Filtros */}
              <AdminTableFilters
                config={{
                  showActiveFilter: true,
                  showDateFilters: true,
                  customFilters: [
                    {
                      label: 'Zona Muscular',
                      options: [
                        { value: 'all', label: 'Todas las zonas' },
                        ...muscleZones.map(zone => ({ 
                          value: zone.name, 
                          label: zone.name 
                        }))
                      ],
                      onChange: setMuscleGroupFilter,
                      value: muscleGroupFilter
                    }
                  ]
                }}
                activeFilter={activeFilter}
                onActiveFilterChange={setActiveFilter}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                onClearFilters={() => {
                  clearFilters()
                  setMuscleGroupFilter('all')
                }}
                hasActiveFilters={hasActiveFilters || muscleGroupFilter !== 'all'}
              />

              {/* Search Bar */}
              <div className="mb-6">
            <div className="relative max-w-md">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quaternary" size={20} />
              <input
                type="text"
                placeholder="Buscar músculo o zona muscular..."
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
              <div className="text-quaternary text-sm font-medium">Nombre</div>
              <div className="text-quaternary text-sm font-medium">Zona Muscular</div>
              <div className="text-quaternary text-sm font-medium">Estado</div>
              <div className="text-quaternary text-sm font-medium">Acciones</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/10">
              {paginated.length === 0 && (
                <div className="p-6 text-quaternary text-sm">No hay músculos para mostrar.</div>
              )}
              {paginated.map((muscle) => (
                <div key={muscle.id} className="grid grid-cols-4 gap-4 p-4 items-center">
                  {/* Name */}
                  <div>
                    <p className="text-white text-sm font-medium">{muscle.name}</p>
                  </div>

                  {/* Muscle Group */}
                  <div>
                    <p className="text-quaternary text-sm">{muscle.muscleGroup?.name || 'N/A'}</p>
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <button
                      onClick={() => handleToggleActive(muscle.id, muscle.active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        muscle.active
                          ? 'border-green-500 text-green-400 hover:bg-green-500/10'
                          : 'border-red-500 text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      {muscle.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditMuscle({
                        id: String(muscle.id),
                        name: muscle.name,
                        muscleGroupId: muscle.muscleGroup?.id || 0,
                        muscleGroupName: muscle.muscleGroup?.name || '',
                        active: muscle.active,
                        imageUrl: muscle.imageUrl,
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
                Mostrando {startIndex + 1} - {Math.min(endIndex, filtered.length)} de {filtered.length} músculo{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
            </>
          )}
        </div>

        {/* Modal */}
        <MuscleAdminModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingMuscle(null)
          }}
          muscle={editingMuscle}
          onSave={handleSaveMuscle}
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
