import { useEffect, useMemo, useState } from "react"
import { LuPlus, LuSearch } from "react-icons/lu"
import { Button } from "../../components/Button"
import { AdminTable, type Column } from "../../components/admin/AdminTable"
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

  // Definición de columnas para AdminTable
  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'Nombre',
      width: 'col-span-1',
      render: (muscle) => (
        <p className="text-white text-sm font-medium">{muscle.name}</p>
      )
    },
    {
      key: 'muscleGroup',
      label: 'Zona Muscular',
      width: 'col-span-1',
      render: (muscle) => (
        <p className="text-quaternary text-sm">{muscle.muscleGroup?.name || 'N/A'}</p>
      )
    },
    {
      key: 'active',
      label: 'Estado',
      width: 'col-span-1',
      render: (muscle) => (
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
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: 'col-span-1',
      render: (muscle) => (
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
      )
    }
  ]

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
          <AdminTable
            columns={columns}
            data={paginated}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filtered.length}
            itemName="músculo"
            itemNamePlural="músculos"
          />
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
