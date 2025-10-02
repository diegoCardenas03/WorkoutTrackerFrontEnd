import { useEffect, useMemo, useState } from "react"
import { LuPlus, LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Button } from "../../components/Button"
import { MuscleAdminModal } from "../../components/admin/Muscles/MuscleAdminModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { fetchMuscles, createMuscle, toggleMuscleActive } from "../../store/slices/muscleSlice"
import { fetchMuscleZones } from "../../store/slices/muscleZoneSlice"
import type { MusculoRequestDTO } from "../../types/musculo/MusculoRequestDTO"
import { Toast } from "../../components/Toast"
import { useAuth0 } from "@auth0/auth0-react"

interface Muscle {
  id: string
  name: string
  muscleGroupId: number
  muscleGroupName: string
  active: boolean
}

export const MusclesAdminView = () => {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const { muscles } = useSelector((s: RootState) => s.muscles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMuscle, setEditingMuscle] = useState<Muscle | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
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
        ;(dispatch as any)(fetchMuscles(token))
        ;(dispatch as any)(fetchMuscleZones(token))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [dispatch, getAccessTokenSilently])

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return muscles
    return muscles.filter((m) =>
      m.name.toLowerCase().includes(term) || 
      m.muscleGroup?.name?.toLowerCase().includes(term)
    )
  }, [muscles, searchTerm])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length])
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage])

  // Clamp current page when filters/data change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [totalPages])

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Build compact page list with ellipses
  const pageItems = useMemo(() => {
    const items: (number | '…')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) items.push(i)
      return items
    }
    const add = (n: number) => items.push(n)
    add(1)
    const left = Math.max(2, currentPage - 1)
    const right = Math.min(totalPages - 1, currentPage + 1)
    if (left > 2) items.push('…')
    for (let i = left; i <= right; i++) add(i)
    if (right < totalPages - 1) items.push('…')
    add(totalPages)
    return items
  }, [currentPage, totalPages])

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

  const handleSaveMuscle = async (muscleData: { name: string; muscleGroupId: number; active: boolean }) => {
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

      console.log('🔑 [MusclesAdminView] Token obtenido, procediendo a guardar...');

      if (editingMuscle) {
        // TODO: Implementar update cuando esté disponible en el backend
        setToast({ msg: 'La edición de músculos estará disponible próximamente', type: 'error' })
        setTimeout(() => setToast(null), 4000)
        return; // Importante: salir aquí
      } else {
        console.log('🚀 [MusclesAdminView] Llamando a createMuscle...');
        const result = await (dispatch as any)(createMuscle({ token, data: payload }))
        
        // Verificar si la acción fue rechazada
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [MusclesAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al crear músculo');
        }
        
        console.log('✅ [MusclesAdminView] Músculo creado exitosamente');
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
          <div className="flex items-center justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LuChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-2">
              {pageItems.map((it, idx) =>
                it === '…' ? (
                  <span key={`dots-${idx}`} className="w-8 h-8 grid place-items-center text-quaternary">…</span>
                ) : (
                  <button
                    key={it}
                    onClick={() => setCurrentPage(it as number)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === it
                        ? 'bg-white text-black'
                        : 'bg-tertiary border border-white/20 text-quaternary hover:text-white'
                    }`}
                  >
                    {it}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
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
