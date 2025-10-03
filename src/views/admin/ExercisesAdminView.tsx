import { useEffect, useMemo, useState } from "react"
import { LuPlus, LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Button } from "../../components/Button"
import { ExerciseAdminModal } from "../../components/admin/Exercises/ExerciseAdminModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { createExercise, fetchExercises, updateExercise, fetchExerciseById, toggleExerciseActive } from "../../store/slices/exerciseSlice"
import type { EjercicioRequestDTO } from "../../types/ejercicio/EjercicioRequestDTO"
import { Toast } from "../../components/Toast"
import { Spinner } from "../../components/Spinner"
import { useAuth0 } from "@auth0/auth0-react"


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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [editingDetails, setEditingDetails] = useState<any | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        })
        ;(dispatch as any)(fetchExercises(token))
      } catch (error) {
        console.error('Error loading exercises:', error)
      }
    }
    loadData()
  }, [dispatch, getAccessTokenSilently])

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return exercises
    return exercises.filter((e) =>
      e.name.toLowerCase().includes(term) || e.description?.toLowerCase().includes(term)
    )
  }, [exercises, searchTerm])

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
      
      console.log('🔑 [ExercisesAdminView] Token obtenido');
      
      let result;
      if (editingExercise) {
        console.log('📝 [ExercisesAdminView] Actualizando ejercicio...');
        result = await (dispatch as any)(updateExercise({ token, id: Number(editingExercise.id), data: payload }))
      } else {
        console.log('🆕 [ExercisesAdminView] Creando ejercicio...');
        result = await (dispatch as any)(createExercise({ token, data: payload }))
      }
      
      // Verificar si la acción fue rechazada
      if (result.type.endsWith('/rejected')) {
        console.error('❌ [ExercisesAdminView] Acción rechazada:', result);
        throw new Error(result.payload || 'Error al guardar ejercicio');
      }
      
      console.log('✅ [ExercisesAdminView] Ejercicio guardado exitosamente');
      
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
          <div className="bg-tertiary rounded-lg border border-white/20 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-white/10 bg-itemsCard">
              <div className="text-quaternary text-sm font-medium">Nombre</div>
              <div className="text-quaternary text-sm font-medium">Descripción</div>
              <div className="text-quaternary text-sm font-medium">Zona a trabajar</div>
              <div className="text-quaternary text-sm font-medium">Estado</div>
              <div className="text-quaternary text-sm font-medium">Acciones</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/10">
              {paginated.length === 0 && (
                <div className="p-6 text-quaternary text-sm">No hay ejercicios para mostrar.</div>
              )}
              {paginated.map((exercise) => (
                <div key={exercise.id} className="grid grid-cols-5 gap-4 p-4 items-center">
        
                  {/* Name */}
                  <div>
                    <p className="text-white text-sm font-medium">{exercise.name}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-quaternary text-sm line-clamp-2">{exercise.description}</p>
                  </div>

                  {/* Target Zone */}
                  <div>
                    <p className="text-white text-sm">{(exercise as any).targetMuscles?.map((m: any) => m.name).join(', ')}</p>
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <button
                      onClick={() => handleToggleActive(exercise.id, (exercise as any).active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        (exercise as any).active
                          ? 'border-green-500 text-green-400 hover:bg-green-500/10'
                          : 'border-red-500 text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      {(exercise as any).active ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>

                  {/* Actions */}
                  <div>
                    <button
                      onClick={() => handleEditExercise({
                        id: String(exercise.id),
                        image: '',
                        name: exercise.name,
                        description: exercise.description,
                        targetZone: (exercise as any).targetMuscles?.map((m: any) => m.name).join(', ') ?? '',
                        status: (exercise as any).active ? 'active' : 'inactive',
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
          <div className="flex flex-col items-center mt-6 gap-3">
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
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

            <p className="text-sm text-quaternary">
              Mostrando {startIndex + 1} - {Math.min(endIndex, filtered.length)} de {filtered.length} ejercicio(s)
            </p>
          </div>
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