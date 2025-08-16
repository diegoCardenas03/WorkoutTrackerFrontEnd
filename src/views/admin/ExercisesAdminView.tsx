import { useState } from "react"
import { LuPlus, LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Button } from "../../components/Button"
import image from "D:\\Proyectos\\WorkoutTracker\\WKFrontEnd\\src\\assets\\mancuerna.jpg"
import { ExerciseAdminModal } from "../../components/admin/Exercises/ExerciseAdminModal"
import { AdminLayout } from "../../layouts/admin/AdminLayout"


interface Exercise {
  id: string
  image: string
  name: string
  description: string
  targetZone: string
  status: 'active' | 'inactive'
}

export const ExercisesAdminView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo
  const exercises: Exercise[] = [
    {
      id: "1",
      image: image,
      name: "Peso muerto",
      description: "Ejercicio para cuádriceps, isquiotibiales y glúteos...",
      targetZone: "Glúteos, isquiotibiales",
      status: "active"
    },
    {
      id: "2",
      image: image,
      name: "Curl predicador",
      description: "Ejercicio de aislamiento para bíceps, donde se realiza el flexionar el codo...",
      targetZone: "Bíceps",
      status: "active"
    },
    {
      id: "3",
      image: image,
      name: "Peso muerto",
      description: "Ejercicio para cuádriceps, isquiotibiales y glúteos...",
      targetZone: "Glúteos, isquiotibiales",
      status: "inactive"
    }
  ]

  const handleCreateExercise = () => {
    setEditingExercise(null)
    setIsModalOpen(true)
  }

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (exerciseId: string) => {
    console.log("Toggle status for exercise:", exerciseId)
    // Aquí iría la lógica para cambiar el estado
  }

  const handleSaveExercise = (exerciseData: any) => {
    console.log("Save exercise:", exerciseData)
    setIsModalOpen(false)
    setEditingExercise(null)
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
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 bg-itemsCard">
              <div className="text-quaternary text-sm font-medium">Imagen</div>
              <div className="text-quaternary text-sm font-medium">Nombre</div>
              <div className="text-quaternary text-sm font-medium">Descripción</div>
              <div className="text-quaternary text-sm font-medium">Zona a trabajar</div>
              <div className="text-quaternary text-sm font-medium">Estado</div>
              <div className="text-quaternary text-sm font-medium">Acciones</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/10">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                  {/* Image */}
                  <div>
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-12 h-12 rounded-lg object-cover border border-white/20"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <p className="text-white text-sm font-medium">{exercise.name}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-quaternary text-sm line-clamp-2">
                      {exercise.description}
                    </p>
                  </div>

                  {/* Target Zone */}
                  <div>
                    <p className="text-white text-sm">{exercise.targetZone}</p>
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <button
                      onClick={() => handleToggleStatus(exercise.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${exercise.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${exercise.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div>
                    <button
                      onClick={() => handleEditExercise(exercise)}
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
              <button className="w-8 h-8 rounded-lg bg-white text-black text-sm font-medium">
                1
              </button>
              <button className="w-8 h-8 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white text-sm transition-colors">
                2
              </button>
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white transition-colors"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Modal */}
        <ExerciseAdminModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingExercise(null)
          }}
          exercise={editingExercise}
          onSave={handleSaveExercise}
        />
      </div>
    </AdminLayout>
  )
}