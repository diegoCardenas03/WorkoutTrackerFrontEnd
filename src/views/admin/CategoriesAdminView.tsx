import { useEffect, useMemo, useState } from "react"
import { LuPlus, LuSearch, LuChevronLeft, LuChevronRight, LuTrash2 } from "react-icons/lu"
import { Button } from "../../components/Button"
import { CategoryAdminModal } from "../../components/admin/Categories/CategoryAdminModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { 
  fetchAllCategories, 
  createCategory,
  updateCategory, 
  toggleCategoryActive,
  hardDeleteCategory 
} from "../../store/slices/categorySlice"
import type { CategoriaRequestDTO } from "../../types/categoria/CategoriaRequestDTO"
import { Toast } from "../../components/Toast"
import { Spinner } from "../../components/Spinner"
import { useAuth0 } from "@auth0/auth0-react"

interface Category {
  id: string
  name: string
  active: boolean
}

export const CategoriesAdminView = () => {
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const { categories, loading } = useSelector((s: RootState) => s.categories)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
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
        ;(dispatch as any)(fetchAllCategories(token))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [dispatch, getAccessTokenSilently])

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(term))
  }, [categories, searchTerm])

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

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
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
      await (dispatch as any)(toggleCategoryActive({ token, id }))
      setToast({ 
        msg: `Categoría ${currentStatus ? 'desactivada' : 'activada'} exitosamente`, 
        type: 'success' 
      })
      setTimeout(() => setToast(null), 3000)
    } catch (error) {
      console.error('Error toggling category status:', error)
      setToast({ msg: 'Error al cambiar el estado de la categoría', type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })
      
      const result = await (dispatch as any)(hardDeleteCategory({ token, id }))
      
      if (result.type.endsWith('/rejected')) {
        throw new Error(result.payload || 'Error al eliminar categoría')
      }
      
      setToast({ msg: 'Categoría eliminada permanentemente', type: 'success' })
      setTimeout(() => setToast(null), 3000)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting category:', error)
      setToast({ msg: 'Error al eliminar categoría', type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const handleSaveCategory = async (categoryData: { name: string; active: boolean }) => {
    const payload: CategoriaRequestDTO = {
      name: categoryData.name,
      active: categoryData.active,
    }

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })

      console.log('🔑 [CategoriesAdminView] Token obtenido');

      if (editingCategory) {
        console.log('🔄 [CategoriesAdminView] Actualizando categoría...');
        const result = await (dispatch as any)(updateCategory({ 
          token, 
          id: Number(editingCategory.id), 
          data: payload 
        }))
        
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [CategoriesAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al actualizar categoría');
        }
        
        console.log('✅ [CategoriesAdminView] Categoría actualizada exitosamente');
        setToast({ msg: 'Categoría actualizada exitosamente', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      } else {
        console.log('🚀 [CategoriesAdminView] Llamando a createCategory...');
        const result = await (dispatch as any)(createCategory({ token, data: payload }))
        
        if (result.type.endsWith('/rejected')) {
          console.error('❌ [CategoriesAdminView] Acción rechazada:', result);
          throw new Error(result.payload || 'Error al crear categoría');
        }
        
        console.log('✅ [CategoriesAdminView] Categoría creada exitosamente');
        setToast({ msg: 'Categoría creada exitosamente', type: 'success' })
        setTimeout(() => setToast(null), 3000)
      }
      
      setIsModalOpen(false)
      setEditingCategory(null)
      ;(dispatch as any)(fetchAllCategories(token))
    } catch (e: any) {
      console.error('❌ [CategoriesAdminView] Error al guardar categoría:', e)
      
      let errorMessage = 'Error al guardar categoría';
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
              <h1 className="text-white text-2xl font-semibold mb-2">Gestionar Categorías</h1>
              <p className="text-quaternary text-sm">Administra las categorías disponibles para ejercicios y rutinas</p>
            </div>

            <Button
              icon={<LuPlus size={16} />}
              iconPosition={false}
              isWhite={true}
              action={handleCreateCategory}
            >
              Crear Categoría
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading Spinner */}
          {loading ? (
            <Spinner size="lg" message="Cargando categorías..." />
          ) : (
            <>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quaternary" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar categoría..."
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
                    <div className="p-6 text-quaternary text-sm">No hay categorías para mostrar.</div>
                  )}
                  {paginated.map((category) => (
                    <div key={category.id} className="grid grid-cols-4 gap-4 p-4 items-center">
                      {/* Name */}
                      <div className="col-span-2">
                        <p className="text-white text-sm font-medium">{category.name}</p>
                      </div>

                      {/* Status Toggle */}
                      <div>
                        <button
                          onClick={() => handleToggleActive(category.id, category.active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            category.active
                              ? 'border-green-500 text-green-400 hover:bg-green-500/10'
                              : 'border-red-500 text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          {category.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditCategory({
                            id: String(category.id),
                            name: category.name,
                            active: category.active,
                          })}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          Editar
                        </button>
                        
                        {showDeleteConfirm === category.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
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
                            onClick={() => setShowDeleteConfirm(category.id)}
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
                    Mostrando {startIndex + 1} - {Math.min(endIndex, filtered.length)} de {filtered.length} categoría{filtered.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        <CategoryAdminModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingCategory(null)
          }}
          category={editingCategory}
          onSave={handleSaveCategory}
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
