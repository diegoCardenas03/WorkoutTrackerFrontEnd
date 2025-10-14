import { useEffect, useMemo, useState } from "react"
import { LuPlus, LuSearch } from "react-icons/lu"
import { Button } from "../../components/Button"
import { AdminTable, type Column } from "../../components/admin/AdminTable"
import { ExerciseAdminModal } from "../../components/admin/Exercises/ExerciseAdminModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { createExercise, fetchExercises, updateExercise, fetchExerciseById, toggleExerciseActive } from "../../store/slices/exerciseSlice"
import { fetchMuscles } from "../../store/slices/muscleSlice"
import { fetchEquipments } from "../../store/slices/equipmentSlice"
import type { EjercicioRequestDTO } from "../../types/ejercicio/EjercicioRequestDTO"
import { Toast } from "../../components/Toast"
import { Spinner } from "../../components/Spinner"
import { useAuth0 } from "@auth0/auth0-react"
import { AdminTableFilters } from "../../components/admin/AdminTableFilters"
import { useAdminTableFilters } from "../../hooks/useAdminTableFilters"


interface Exercise {
  id: string
  image: string
  name: string
  description: string
  targetZone: string
  status: 'active' | 'inactive'
}

export const ExercisesAdminView = () => {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const { exercises, loading } = useSelector((s: RootState) => s.exercises)
  const { equipments } = useSelector((s: RootState) => s.equipments)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [editingDetails, setEditingDetails] = useState<any | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [muscleFilter, setMuscleFilter] = useState<string>('all')
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all')
  
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
  } = useAdminTableFilters(exercises)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        })
        // Cargar ejercicios, músculos y equipamiento
        ;(dispatch as any)(fetchExercises(token))
        ;(dispatch as any)(fetchMuscles(token))
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
      width: 'col-span-1',
      render: (exercise) => (
        <p className="text-white text-sm font-medium">{exercise.name}</p>
      )
    },
    {
      key: 'description',
      label: 'Descripción',
      width: 'col-span-1',
      render: (exercise) => (
        <p className="text-quaternary text-sm line-clamp-2">{exercise.description}</p>
      )
    },
    {
      key: 'targetZone',
      label: 'Zona a trabajar',
      width: 'col-span-1',
      render: (exercise) => (
        <p className="text-white text-sm">{exercise.targetMuscles?.map((m: any) => m.name).join(', ')}</p>
      )
    },
    {
      key: 'active',
      label: 'Estado',
      width: 'col-span-1',
      render: (exercise) => (
        <button
          onClick={() => handleToggleActive(exercise.id, exercise.active)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            exercise.active
              ? 'border-green-500 text-green-400 hover:bg-green-500/10'
              : 'border-red-500 text-red-400 hover:bg-red-500/10'
          }`}
        >
          {exercise.active ? 'Activo' : 'Inactivo'}
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: 'col-span-1',
      render: (exercise) => (
        <button
          onClick={() => handleEditExercise({
            id: String(exercise.id),
            image: '',
            name: exercise.name,
            description: exercise.description,
            targetZone: exercise.targetMuscles?.map((m: any) => m.name).join(', ') ?? '',
            status: exercise.active ? 'active' : 'inactive',
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
    
    // Filtro por músculo objetivo
    if (muscleFilter !== 'all') {
      result = result.filter((e) => 
        e.targetMuscles?.some(m => m.name.toLowerCase() === muscleFilter.toLowerCase())
      )
    }
    
    // Filtro por equipamiento
    if (equipmentFilter !== 'all') {
      result = result.filter((e) => 
        e.equipment?.some(eq => eq.name.toLowerCase() === equipmentFilter.toLowerCase())
      )
    }
    
    // Filtro por búsqueda
    const term = searchTerm.trim().toLowerCase()
    if (term) {
      result = result.filter((e) =>
        e.name.toLowerCase().includes(term) || e.description?.toLowerCase().includes(term)
      )
    }
    
    return result
  }, [filteredAndSorted, searchTerm, muscleFilter, equipmentFilter])

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

  const handleCreateExercise = () => {
    setEditingExercise(null)
    setIsModalOpen(true)
  }

  const handleEditExercise = async (exercise: Exercise) => {
    setEditingExercise(exercise)
    setEditingDetails(null)
    setIsModalOpen(true)
    // Cargar detalles desde backend para videos, instrucciones y músculos
    try {
      const res = await (dispatch as any)(fetchExerciseById(Number(exercise.id)))
      const payload = (res as any).payload
      setEditingDetails(payload ?? null)
    } catch {}
  }

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })
      
      const result = await (dispatch as any)(toggleExerciseActive({ token, id }))
      
      // Verificar si la acción fue rechazada
      if (result.type.endsWith('/rejected')) {
        throw new Error(result.payload || 'Error al cambiar estado')
      }
      
      setToast({ 
        msg: `Ejercicio ${currentStatus ? 'desactivado' : 'activado'} exitosamente`, 
        type: 'success' 
      })
      setTimeout(() => setToast(null), 3000)
    } catch (error: any) {
      console.error('Error toggling exercise status:', error)
      
      let errorMessage = 'Error al cambiar el estado del ejercicio'
      
      // Manejar error 409: Debe haber al menos 1 músculo objetivo activo
      if (error?.message?.includes('músculo objetivo activo')) {
        errorMessage = 'No se puede activar: Debe tener al menos 1 músculo objetivo activo'
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      setToast({ msg: errorMessage, type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const handleSaveExercise = async (exerciseData: any) => {
    const payload: EjercicioRequestDTO = {
      name: exerciseData.name,
      description: exerciseData.description,
      active: exerciseData.active ?? true,
  tips: exerciseData.tips || undefined,
      instructions: (exerciseData.instructions ?? []).reduce((acc: Record<number, string>, cur: any, idx: number) => {
        const text = typeof cur === 'string' ? cur : cur?.text
        if (text != null && String(text).trim() !== '') acc[idx + 1] = String(text)
        return acc
      }, {}),
  sampleVideos: (exerciseData.videoLinks ?? []).filter((x: string) => !!x && x.trim().length > 0),
  equipmentIds: (exerciseData.equipmentIds ?? []) as number[],
      targetMuscleIds: (exerciseData.muscleIds ?? []) as number[],
    }

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })
      
      // console.log('🔑 [ExercisesAdminView] Token obtenido');
      
      let result;
      if (editingExercise) {
        // console.log('📝 [ExercisesAdminView] Actualizando ejercicio...');
        result = await (dispatch as any)(updateExercise({ token, id: Number(editingExercise.id), data: payload }))
      } else {
        // console.log('🆕 [ExercisesAdminView] Creando ejercicio...');
        result = await (dispatch as any)(createExercise({ token, data: payload }))
      }
      
      // Verificar si la acción fue rechazada
      if (result.type.endsWith('/rejected')) {
        console.error('❌ [ExercisesAdminView] Acción rechazada:', result);
        throw new Error(result.payload || 'Error al guardar ejercicio');
      }
      
      // console.log('✅ [ExercisesAdminView] Ejercicio guardado exitosamente');
      
      setIsModalOpen(false)
      setEditingExercise(null)
      setEditingDetails(null)
      
      // Recargar ejercicios
      ;(dispatch as any)(fetchExercises(token))
      
      setToast({ msg: editingExercise ? 'Ejercicio actualizado exitosamente' : 'Ejercicio creado exitosamente', type: 'success' })
      setTimeout(() => setToast(null), 3000)
    } catch (e: any) {
      console.error('❌ [ExercisesAdminView] Error al guardar ejercicio:', e)
      
      let errorMessage = 'Error al guardar ejercicio';
      
      // Manejar errores de validación del backend
      if (e?.message?.includes('músculo objetivo activo')) {
        errorMessage = 'No se puede activar: Debe tener al menos 1 músculo objetivo activo';
      } else if (e?.message?.includes('Equipamiento') && e?.message?.includes('inactivo')) {
        // Extraer el mensaje completo del backend
        errorMessage = e.message.includes('con el ID') 
          ? `${e.message}. Actívalo primero o quítalo del ejercicio`
          : 'No se puede usar equipamiento inactivo';
      } else if (e?.message?.includes('404')) {
        errorMessage = 'Recurso no encontrado. Verifica que todos los elementos existan';
      } else if (e?.message?.includes('403') || e?.message?.includes('Forbidden')) {
        errorMessage = 'No tienes permisos de administrador. Verifica tu rol en Auth0.';
      } else if (e?.message?.includes('401') || e?.message?.includes('Unauthorized')) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      setToast({ msg: errorMessage, type: 'error' })
      setTimeout(() => setToast(null), 5000)
    }
  }

  return (
    <AdminLayout>
      <div className="flex-1 bg-primary">
        {/* Header */}
        <div className="bg-tertiary border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-semibold mb-2">Gestionar Ejercicios</h1>
              <p className="text-quaternary text-sm">Administra la biblioteca de ejercicios</p>
            </div>

            <Button
              icon={<LuPlus size={16} />}
              iconPosition={false}
              isWhite={true}
              action={handleCreateExercise}
            >
              Crear Ejercicio
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading Spinner */}
          {loading ? (
            <Spinner size="lg" message="Cargando ejercicios..." />
          ) : (
            <>
              {/* Filtros */}
              <AdminTableFilters
                config={{
                  showActiveFilter: true,
                  showDateFilters: true,
                  customFilters: [
                    {
                      label: 'Músculo Objetivo',
                      options: [
                        { value: 'all', label: 'Todos los músculos' },
                        ...Array.from(new Set(
                          exercises.flatMap(e => e.targetMuscles?.map(m => m.name) || [])
                        )).sort().map(muscle => ({ 
                          value: muscle, 
                          label: muscle 
                        }))
                      ],
                      onChange: setMuscleFilter,
                      value: muscleFilter
                    },
                    {
                      label: 'Equipamiento',
                      options: [
                        { value: 'all', label: 'Todo el equipamiento' },
                        ...equipments
                          .filter(eq => eq.active !== false)
                          .map(eq => ({ 
                            value: eq.name, 
                            label: eq.name 
                          }))
                      ],
                      onChange: setEquipmentFilter,
                      value: equipmentFilter
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
                  setMuscleFilter('all')
                  setEquipmentFilter('all')
                }}
                hasActiveFilters={hasActiveFilters || muscleFilter !== 'all' || equipmentFilter !== 'all'}
              />

              {/* Search Bar */}
              <div className="mb-6">
            <div className="relative max-w-md">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quaternary" size={20} />
              <input
                type="text"
                placeholder="Buscar ejercicio..."
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
            itemName="ejercicio"
            itemNamePlural="ejercicios"
          />
            </>
          )}
        </div>

        {/* Modal */}
        <ExerciseAdminModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingExercise(null)
            setEditingDetails(null)
          }}
          exercise={editingExercise}
          exerciseDetails={editingDetails}
          isLoadingDetails={!!editingExercise && !editingDetails}
          onSave={handleSaveExercise}
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