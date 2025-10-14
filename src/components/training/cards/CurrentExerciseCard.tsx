import { LuMaximize2, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { useState, useEffect } from "react"

interface Tag {
    label: string
    color: 'green' | 'blue' | 'yellow' | 'red' | 'orange'
}

interface CurrentExerciseCardProps {
    title: string
    category: string
    tags: Tag[]
    sets: string
    reps: string
    weight: string
    restTime: string
    notes?: string
    videoUrls?: string[]
}

export const CurrentExerciseCard = ({
    title,
    category,
    sets,
    reps,
    notes,
    videoUrls
}: CurrentExerciseCardProps) => {
    const [showFullScreen, setShowFullScreen] = useState(false)
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

    // Reset video index when exercise changes (identified by title or videoUrls change)
    useEffect(() => {
        setCurrentVideoIndex(0)
    }, [title, videoUrls])

    const hasVideos = videoUrls && videoUrls.length > 0
    const hasMultipleVideos = videoUrls && videoUrls.length > 1
    const currentVideoUrl = hasVideos ? videoUrls[currentVideoIndex] : undefined

    const handlePreviousVideo = () => {
        if (hasMultipleVideos) {
            setCurrentVideoIndex((prev) => (prev === 0 ? videoUrls.length - 1 : prev - 1))
        }
    }

    const handleNextVideo = () => {
        if (hasMultipleVideos) {
            setCurrentVideoIndex((prev) => (prev === videoUrls.length - 1 ? 0 : prev + 1))
        }
    }

    return (
        <>
            <div className="bg-tertiary rounded-lg border border-white/10 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <div>
                        <h2 className="text-white text-lg sm:text-xl font-semibold mb-1">
                            {title}
                        </h2>
                        <span className="text-quaternary text-sm bg-itemsCard px-2 py-1 rounded-lg">
                            {category}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-white text-lg sm:text-xl font-medium">
                        <span>{sets}</span>
                        <span className="text-quaternary">x</span>
                        <span>{reps}</span>
                    </div>
                </div>


                {/* Video/Image placeholder */}
                {hasVideos ? (
                    <div className="relative bg-itemsCard rounded-lg h-48 sm:h-64 overflow-hidden mb-4 border border-white/10">
                        <iframe
                            src={currentVideoUrl}
                            className="w-full h-full"
                            title={`Video demostrativo de ${title}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <button
                            onClick={() => setShowFullScreen(true)}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 p-2 rounded-full text-white transition-colors"
                            title="Ver en pantalla completa"
                        >
                            <LuMaximize2 size={20} />
                        </button>

                        {/* Video Navigation */}
                        {hasMultipleVideos && (
                            <>
                                <button
                                    onClick={handlePreviousVideo}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full text-white transition-colors"
                                    title="Video anterior"
                                >
                                    <LuChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={handleNextVideo}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full text-white transition-colors"
                                    title="Siguiente video"
                                >
                                    <LuChevronRight size={24} />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                                    Video {currentVideoIndex + 1}/{videoUrls.length}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="bg-itemsCard rounded-lg h-48 sm:h-64 flex items-center justify-center mb-4 border border-white/10">
                        <p className="text-quaternary text-sm">Video no disponible</p>
                    </div>
                )}

               

                {/* Notes */}
                {notes && (
                    <div className="bg-itemsCard rounded-lg p-3 border border-white/10">
                        <p className="text-quaternary text-sm font-medium mb-1">Notas:</p>
                        <p className="text-white text-sm">{notes}</p>
                    </div>
                )}
            </div>

            {/* Modal de video en pantalla completa */}
            {showFullScreen && hasVideos && (
                <div 
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowFullScreen(false)}
                >
                    <button
                        onClick={() => setShowFullScreen(false)}
                        className="absolute top-4 right-4 text-white hover:text-quaternary transition-colors z-10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <div 
                        className="w-full max-w-6xl aspect-video relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            src={currentVideoUrl}
                            className="w-full h-full rounded-lg"
                            title={`Video demostrativo de ${title}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        
                        {/* Video Navigation in Fullscreen */}
                        {hasMultipleVideos && (
                            <>
                                <button
                                    onClick={handlePreviousVideo}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-3 rounded-full text-white transition-colors"
                                    title="Video anterior"
                                >
                                    <LuChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={handleNextVideo}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-3 rounded-full text-white transition-colors"
                                    title="Siguiente video"
                                >
                                    <LuChevronRight size={32} />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-base">
                                    Video {currentVideoIndex + 1}/{videoUrls.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}