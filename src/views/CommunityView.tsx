import { LuBookmark, LuHeart, LuTrendingUp, LuUsers } from "react-icons/lu"
import { FeatureCard } from "../components/FeatureCard"
import { SubHeader } from "../components/SubHeader"
import { PrivateLayout } from "../layouts/PrivateLayout"
import { SearchBar } from "../components/SearchBar"
import { CustomSelect } from "../components/CustomSelect"
import { CommunityExerciseCard } from "../components/community/cards/CommunityRoutineCard"
import { useEffect, useState, useMemo } from "react"
import { CommentsModal } from "../components/community/modals/CommentsModal"
import { CommunityRoutineModal } from "../components/community/modals/CommunityRoutineModal"
import { useDispatch, useSelector } from "react-redux"
import { fetchPublicRoutines, likeRoutine, savePublicRoutine, updateStats } from "../store/slices/communitySlice"
import { fetchComentariosByRoutine, createComentario, toggleLikeComentario, updateComentarioContent, deleteOwnComentario } from "../store/slices/comentarioSlice"
import { fetchCategories } from "../store/slices/categorySlice"
import { useAuth0 } from "@auth0/auth0-react"
import type { RootState } from "../store"
import type { RutinaResponseDTO } from "../types/rutina/RutinaResponseDTO"
import { Spinner } from "../components/Spinner"
import { Toast } from "../components/Toast"


export const CommunityView = () => {
    const dispatch = useDispatch()
    const { getAccessTokenSilently, user } = useAuth0()
    
    const publicRoutines = useSelector((state: RootState) => state.community?.routines ?? [])
    const loading = useSelector((state: RootState) => state.community?.loading ?? false)
    const stats = useSelector((state: RootState) => state.community?.stats)
    const categoriesFromStore = useSelector((state: RootState) => state.categories?.categories ?? [])
    const comments = useSelector((state: RootState) => state.comentarios?.comments ?? [])
    
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false)
    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false)
    const [selectedRoutineForComments, setSelectedRoutineForComments] = useState<RutinaResponseDTO | null>(null)
    const [selectedRoutineForDetails, setSelectedRoutineForDetails] = useState<RutinaResponseDTO | null>(null)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedDifficulty, setSelectedDifficulty] = useState("")
    const [selectedSort, setSelectedSort] = useState("likes")
    const [searchTerm, setSearchTerm] = useState("")
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [showErrorToast, setShowErrorToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [commentsCountByRoutine, setCommentsCountByRoutine] = useState<Record<number, number>>({})
    const [initialLoading, setInitialLoading] = useState(true)
    const [likedRoutines, setLikedRoutines] = useState<Set<number>>(new Set())
    const [savedRoutines, setSavedRoutines] = useState<Set<number>>(new Set())

    useEffect(() => {
        // Cargar rutinas públicas y categorías
        const loadData = async () => {
            const startTime = Date.now()
            
            await (dispatch as any)(fetchPublicRoutines())
            
            if (categoriesFromStore.length === 0) {
                try {
                    const token = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        },
                    })
                    await (dispatch as any)(fetchCategories(token))
                } catch (error) {
                    console.error("Error al cargar categorías:", error)
                }
            }
            
            // Delay mínimo de 500ms para UX profesional
            const elapsed = Date.now() - startTime
            if (elapsed < 500) {
                await new Promise(resolve => setTimeout(resolve, 500 - elapsed))
            }
            setInitialLoading(false)
        }
        loadData()
    }, [dispatch, getAccessTokenSilently, categoriesFromStore.length])

    useEffect(() => {
        // Actualizar estadísticas cuando cambien las rutinas
        if (publicRoutines.length > 0) {
            dispatch(updateStats())
        }
    }, [publicRoutines, dispatch])

    const handleOpenComments = async (routine: RutinaResponseDTO) => {
        setSelectedRoutineForComments(routine)
        setIsCommentsModalOpen(true)
        
        // Cargar comentarios de esta rutina
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            })
            await (dispatch as any)(fetchComentariosByRoutine({ token, routineId: routine.id }))
        } catch (error) {
            console.error("Error al cargar comentarios:", error)
        }
    }

    const handleCloseComments = () => {
        setIsCommentsModalOpen(false)
        setSelectedRoutineForComments(null)
    }

    const handleOpenRoutineDetails = async (routine: RutinaResponseDTO) => {
        setSelectedRoutineForDetails(routine)
        setIsRoutineModalOpen(true)
        // Cargar comentarios para mostrar el contador
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            })
            await (dispatch as any)(fetchComentariosByRoutine({ token, routineId: routine.id }))
        } catch (error) {
            console.error("Error al cargar comentarios:", error)
        }
    }

    const handleCloseRoutineDetails = () => {
        setIsRoutineModalOpen(false)
        setSelectedRoutineForDetails(null)
    }

    const handleAddComment = async (content: string, replyToId?: number) => {
        if (!selectedRoutineForComments) return
        
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            })
            
            await (dispatch as any)(createComentario({
                token,
                dto: {
                    content,
                    routineId: selectedRoutineForComments.id,
                    replyToId,
                }
            })).unwrap()
            
            // Recargar comentarios
            await (dispatch as any)(fetchComentariosByRoutine({ token, routineId: selectedRoutineForComments.id }))
        } catch (error: any) {
            console.error("Error al crear comentario:", error)
            setToastMessage(error || "Error al crear comentario")
            setShowErrorToast(true)
        }
    }

    const handleLikeComment = async (commentId: number) => {
        if (!selectedRoutineForComments) return
        
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            })
            
            await (dispatch as any)(toggleLikeComentario({ token, id: commentId })).unwrap()
            
            // Recargar comentarios para actualizar el contador de likes
            await (dispatch as any)(fetchComentariosByRoutine({ token, routineId: selectedRoutineForComments.id }))
        } catch (error: any) {
            console.error("Error al dar like al comentario:", error)
            setToastMessage(error || "Error al dar like al comentario")
            setShowErrorToast(true)
        }
    }

    const handleEditComment = async (commentId: number, content: string) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            })
            
            await (dispatch as any)(updateComentarioContent({ 
                token, 
                id: commentId, 
                dto: { content } 
            })).unwrap()
            
            setToastMessage("Comentario actualizado")
            setShowSuccessToast(true)
        } catch (error: any) {
            console.error("Error al editar comentario:", error)
            setToastMessage(error || "Error al editar comentario")
            setShowErrorToast(true)
        }
    }

    const handleDeleteComment = async (commentId: number) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            })
            
            await (dispatch as any)(deleteOwnComentario({ token, id: commentId })).unwrap()
            
            setToastMessage("Comentario eliminado")
            setShowSuccessToast(true)
        } catch (error: any) {
            console.error("Error al eliminar comentario:", error)
            setToastMessage(error || "Error al eliminar comentario")
            setShowErrorToast(true)
        }
    }

    const handleLike = async (routine: RutinaResponseDTO) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            })
            
            const isLiked = likedRoutines.has(routine.id)
            
            console.log('🔵 Dando like a rutina:', routine.id, 'isLiked:', isLiked)
            
            const result = await (dispatch as any)(likeRoutine({ token, routineId: routine.id, isLiked })).unwrap()
            
            console.log('🟢 Resultado de like:', result)
            
            // Actualizar estado local inmediatamente (optimistic update)
            setLikedRoutines(prev => {
                const newSet = new Set(prev)
                if (isLiked) {
                    newSet.delete(routine.id)
                } else {
                    newSet.add(routine.id)
                }
                return newSet
            })
            
            // NO recargar rutinas para evitar el spinner
            // El contador se actualiza optimistamente en el estado local
            
            setToastMessage(isLiked ? "Like eliminado" : "¡Like agregado!")
            setShowSuccessToast(true)
        } catch (error: any) {
            console.error("🔴 Error completo al dar like:", error)
            setToastMessage(error.message || error.toString() || "Error al dar like")
            setShowErrorToast(true)
            
            // Revertir cambio optimista si hay error
            setLikedRoutines(prev => {
                const newSet = new Set(prev)
                const isLiked = likedRoutines.has(routine.id)
                if (isLiked) {
                    newSet.add(routine.id)
                } else {
                    newSet.delete(routine.id)
                }
                return newSet
            })
        }
    }

    const handleSave = async (routine: RutinaResponseDTO) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            })
            
            const isSaved = savedRoutines.has(routine.id)
            
            console.log('🔵 Guardando rutina:', routine.id, 'isSaved:', isSaved)
            
            const result = await (dispatch as any)(savePublicRoutine({ token, routineId: routine.id, isSaved })).unwrap()
            
            console.log('🟢 Resultado de save:', result)
            
            // Actualizar estado local inmediatamente (optimistic update)
            setSavedRoutines(prev => {
                const newSet = new Set(prev)
                if (isSaved) {
                    newSet.delete(routine.id)
                } else {
                    newSet.add(routine.id)
                }
                return newSet
            })
            
            setToastMessage(isSaved ? "Rutina quitada de guardadas" : "Rutina guardada")
            setShowSuccessToast(true)
        } catch (error: any) {
            console.error("🔴 Error completo al guardar rutina:", error)
            setToastMessage(error.message || error.toString() || "Error al guardar rutina")
            setShowErrorToast(true)
            
            // Revertir cambio optimista si hay error
            setSavedRoutines(prev => {
                const newSet = new Set(prev)
                const isSaved = savedRoutines.has(routine.id)
                if (isSaved) {
                    newSet.add(routine.id)
                } else {
                    newSet.delete(routine.id)
                }
                return newSet
            })
        }
    }

    // Mapear dificultad
    const mapDifficultyToLabel = (difficulty: string): string => {
        const diff = String(difficulty)
        switch (diff) {
            case 'PRINCIPIANTE':
                return 'Principiante'
            case 'INTERMEDIO':
                return 'Intermedio'
            case 'AVANZADO':
                return 'Avanzado'
            default:
                return diff
        }
    }

    const mapDifficultyToColor = (difficulty: string): 'green' | 'yellow' | 'red' => {
        const diff = String(difficulty)
        switch (diff) {
            case 'PRINCIPIANTE':
                return 'green'
            case 'INTERMEDIO':
                return 'yellow'
            case 'AVANZADO':
                return 'red'
            default:
                return 'green'
        }
    }

    // Filtrar y ordenar rutinas
    const filteredAndSortedRoutines = useMemo(() => {
        let filtered = publicRoutines.filter(routine => {
            // Filtro por categoría
            if (selectedCategory && routine.category?.name !== selectedCategory) {
                return false
            }
            
            // Filtro por dificultad
            if (selectedDifficulty) {
                const difficultyMap: Record<string, string> = {
                    "easy": "PRINCIPIANTE",
                    "medium": "INTERMEDIO",
                    "hard": "AVANZADO"
                }
                if (routine.difficulty !== difficultyMap[selectedDifficulty]) {
                    return false
                }
            }
            
            // Filtro por búsqueda
            if (searchTerm) {
                const search = searchTerm.toLowerCase()
                return (
                    routine.name.toLowerCase().includes(search) ||
                    routine.description?.toLowerCase().includes(search) ||
                    routine.user?.name?.toLowerCase().includes(search)
                )
            }
            
            return true
        })
        
        // Ordenar
        if (selectedSort === "likes") {
            filtered = filtered.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
        } else if (selectedSort === "newest") {
            filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
        
        return filtered
    }, [publicRoutines, selectedCategory, selectedDifficulty, searchTerm, selectedSort])

    // Convertir ComentarioResponseDTO a Comment para el modal
    const mappedComments = useMemo(() => {
        // Separar comentarios principales y respuestas
        const mainComments = comments.filter(c => !c.replyTo)
        
        return mainComments.map(comment => {
            const timeAgo = (() => {
                const now = new Date()
                const created = new Date(comment.createdAt)
                const diffMs = now.getTime() - created.getTime()
                const diffMins = Math.floor(diffMs / 60000)
                const diffHours = Math.floor(diffMs / 3600000)
                const diffDays = Math.floor(diffMs / 86400000)
                
                if (diffMins < 1) return 'Hace un momento'
                if (diffMins < 60) return `Hace ${diffMins} min`
                if (diffHours < 24) return `Hace ${diffHours} h`
                return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`
            })()
            
            // Buscar respuestas a este comentario
            const replies = comments
                .filter(c => c.replyTo?.id === comment.id)
                .map(reply => {
                    const replyTimeAgo = (() => {
                        const now = new Date()
                        const created = new Date(reply.createdAt)
                        const diffMs = now.getTime() - created.getTime()
                        const diffMins = Math.floor(diffMs / 60000)
                        const diffHours = Math.floor(diffMs / 3600000)
                        const diffDays = Math.floor(diffMs / 86400000)
                        
                        if (diffMins < 1) return 'Hace un momento'
                        if (diffMins < 60) return `Hace ${diffMins} min`
                        if (diffHours < 24) return `Hace ${diffHours} h`
                        return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`
                    })()
                    
                    // Verificar si el autor de la respuesta es el creador de la rutina
                    const isReplyCreator = selectedRoutineForComments?.user?.id === reply.user?.id ||
                                          selectedRoutineForDetails?.user?.id === reply.user?.id
                    
                    return {
                        id: String(reply.id),
                        author: {
                            name: reply.user?.name || "Usuario",
                            initials: reply.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "U",
                            badge: isReplyCreator ? "Creador" : "Miembro de la comunidad",
                            auth0UserId: reply.user?.email // Usamos email como identificador único
                        },
                        content: reply.content,
                        timeAgo: replyTimeAgo,
                        likes: reply.likes || 0
                    }
                })
            
            // Verificar si el autor del comentario es el creador de la rutina
            const isCreator = selectedRoutineForComments?.user?.id === comment.user?.id ||
                             selectedRoutineForDetails?.user?.id === comment.user?.id
            
            return {
                id: String(comment.id),
                author: {
                    name: comment.user?.name || "Usuario",
                    initials: comment.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "U",
                    badge: isCreator ? "Creador" : "Miembro de la comunidad",
                    auth0UserId: comment.user?.email // Usamos email como identificador único
                },
                content: comment.content,
                timeAgo,
                likes: comment.likes || 0,
                replies
            }
        })
    }, [comments, selectedRoutineForComments, selectedRoutineForDetails])

    // Cargar el conteo de comentarios para las rutinas visibles
    useEffect(() => {
        const loadCommentsCount = async () => {
            if (filteredAndSortedRoutines.length === 0) return
            
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    },
                })
                
                const counts: Record<number, number> = {}
                
                // Cargar comentarios de cada rutina
                for (const routine of filteredAndSortedRoutines) {
                    try {
                        const response = await fetch(`http://localhost:8080/api/comments/routine/${routine.id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        
                        if (response.ok) {
                            const routineComments = await response.json()
                            // Contar todos los comentarios (principales + respuestas)
                            counts[routine.id] = routineComments.length
                        } else {
                            counts[routine.id] = 0
                        }
                    } catch (error) {
                        console.error(`Error al cargar comentarios de rutina ${routine.id}:`, error)
                        counts[routine.id] = 0
                    }
                }
                
                setCommentsCountByRoutine(counts)
            } catch (error) {
                console.error("Error al obtener token:", error)
            }
        }
        
        loadCommentsCount()
    }, [filteredAndSortedRoutines, getAccessTokenSilently])

    const categories = [
        { value: "", label: "Todas las categorías" },
        ...categoriesFromStore.filter(c => c.active !== false).map(c => ({
            value: c.name,
            label: c.name
        }))
    ]

    const difficulties = [
        { value: "", label: "Todas las dificultades" },
        { value: "easy", label: "Principiante" },
        { value: "medium", label: "Intermedio" },
        { value: "hard", label: "Avanzado" },
    ]

    const sortOptions = [
        { value: "likes", label: "Más likes" },
        { value: "newest", label: "Más recientes" },
    ]

    // Agrupar rutinas en grupos de 3
    const groupedRoutines = []
    for (let i = 0; i < filteredAndSortedRoutines.length; i += 3) {
        groupedRoutines.push(filteredAndSortedRoutines.slice(i, i + 3))
    }

    if (initialLoading) {
        return (
            <PrivateLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Spinner message="Cargando rutinas de la comunidad..." size="md" />
                </div>
            </PrivateLayout>
        )
    }

    return (
        <PrivateLayout>
            <SubHeader nameView="Rutinas de la Comunidad" description="Descubre, valora y comparte rutinas creadas por otros usuarios" />
            <div className="flex flex-col mt-6 gap-6">
                <div className="flex flex-col xl:flex-row justify-between gap-5 xl:gap-20">
                    <FeatureCard
                        icon={<LuUsers size={20} className="text-[#89B4DB]" />}
                        title="Total rutinas"
                        value={stats?.totalRoutines.toString() || "0"}
                    />
                    <FeatureCard
                        icon={<LuHeart size={20} className="text-[#FF0000]" />}
                        title="Total likes"
                        value={stats?.totalLikes.toString() || "0"}
                    />
                    <FeatureCard
                        icon={<LuBookmark size={20} className="text-[#04D932]" />}
                        title="Total guardados"
                        value={stats?.totalSaves.toString() || "0"}
                    />
                    <FeatureCard
                        icon={<LuTrendingUp size={20} className="text-[#FF8800]" />}
                        title="Categoría popular"
                        value={stats?.popularCategory || "—"}
                    />
                </div>
                <div className="p-6 flex flex-col bg-tertiary rounded-lg gap-4 border border-white/20">
                    <SearchBar
                        placeholder="Buscar rutinas, autores o palabras clave..."
                        onSearch={setSearchTerm}
                    />
                    <div className="flex xl:flex-row flex-col w-full gap-4">
                        <CustomSelect
                            name="Todas las categorias"
                            options={categories}
                            defaultValue={selectedCategory}
                            onChange={setSelectedCategory}
                        />
                        <CustomSelect
                            name="Todas las dificultades"
                            options={difficulties}
                            defaultValue={selectedDifficulty}
                            onChange={setSelectedDifficulty}
                        />
                        <CustomSelect
                            name="Ordenar por"
                            options={sortOptions}
                            defaultValue={selectedSort}
                            onChange={setSelectedSort}
                        />
                    </div>
                </div>

                {loading ? (
                    <Spinner message="Cargando rutinas de la comunidad..." size="md" />
                ) : filteredAndSortedRoutines.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-quaternary text-lg">
                            {publicRoutines.length === 0
                                ? 'No hay rutinas públicas disponibles'
                                : 'No se encontraron rutinas con los filtros seleccionados'}
                        </p>
                    </div>
                ) : (
                    groupedRoutines.map((group, groupIndex) => (
                        <div key={groupIndex} className="flex flex-col xl:flex-row justify-between gap-5">
                            {group.map((routine) => {
                                const totalExercises = routine.sessions?.reduce(
                                    (sum, s) => sum + (s.sessionExercises?.length || 0),
                                    0
                                ) || 0

                                return (
                                    <CommunityExerciseCard
                                        key={routine.id}
                                        title={routine.name}
                                        description={routine.description || ""}
                                        author={{
                                            name: routine.user?.name || "Usuario",
                                            title: "Miembro de la comunidad",
                                            initials: routine.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "U"
                                        }}
                                        exerciseCount={totalExercises}
                                        tags={routine.category ? [routine.category.name] : []}
                                        difficulty={{
                                            label: mapDifficultyToLabel(routine.difficulty),
                                            color: mapDifficultyToColor(routine.difficulty)
                                        }}
                                        rating={0} // TODO: Implementar sistema de rating si existe
                                        likes={routine.likesCount || 0}
                                        saves={0} // TODO: Implementar contador de guardados si existe
                                        comments={commentsCountByRoutine[routine.id] || 0}
                                        publishDate={new Date(routine.createdAt).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                        isLiked={likedRoutines.has(routine.id)}
                                        isSaved={savedRoutines.has(routine.id)}
                                        isOwnRoutine={routine.user?.email === user?.email}
                                        onLike={() => handleLike(routine)}
                                        onSave={() => handleSave(routine)}
                                        onComments={() => handleOpenComments(routine)}
                                        onClick={() => handleOpenRoutineDetails(routine)}
                                    />
                                )
                            })}
                        </div>
                    ))
                )}
            </div>

            <CommentsModal
                isOpen={isCommentsModalOpen}
                onClose={handleCloseComments}
                exerciseTitle={selectedRoutineForComments?.name || ""}
                comments={mappedComments}
                currentUserAuth0Id={user?.email}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
            />

            <CommunityRoutineModal
                isOpen={isRoutineModalOpen}
                onClose={handleCloseRoutineDetails}
                routine={selectedRoutineForDetails}
                commentsCount={comments.length}
                isLiked={selectedRoutineForDetails ? likedRoutines.has(selectedRoutineForDetails.id) : false}
                isSaved={selectedRoutineForDetails ? savedRoutines.has(selectedRoutineForDetails.id) : false}
                isOwnRoutine={selectedRoutineForDetails?.user?.email === user?.email}
                onLike={() => {
                    if (selectedRoutineForDetails) {
                        handleLike(selectedRoutineForDetails)
                    }
                }}
                onSave={() => {
                    if (selectedRoutineForDetails) {
                        handleSave(selectedRoutineForDetails)
                        // No cerrar el modal para que vea el cambio
                    }
                }}
                onComments={() => {
                    if (selectedRoutineForDetails) {
                        handleCloseRoutineDetails()
                        handleOpenComments(selectedRoutineForDetails)
                    }
                }}
            />

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
        </PrivateLayout>
    )
}
