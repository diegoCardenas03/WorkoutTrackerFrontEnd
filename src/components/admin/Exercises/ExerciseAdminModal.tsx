import { useState, useEffect, useMemo, useRef } from "react"
import { IoClose } from "react-icons/io5"
import { LuPlus, LuX, LuChevronDown, LuChevronUp, LuSearch } from "react-icons/lu"
import { Button } from "../../Button"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../store"
import { fetchMuscles } from "../../../store/slices/muscleSlice"
import type { EjercicioResponseDTO } from "../../../types/ejercicio/EjercicioResponseDTO"
import { fetchEquipments } from "../../../store/slices/equipmentSlice"

interface Exercise {
  id: string
  image: string
  name: string
  description: string
  targetZone: string
  status: 'active' | 'inactive'
}

interface ExerciseAdminModalProps {
  isOpen: boolean
  onClose: () => void
  exercise?: Exercise | null
  exerciseDetails?: EjercicioResponseDTO | null
  isLoadingDetails?: boolean
  onSave: (exerciseData: any) => void
}

export const ExerciseAdminModal = ({
  isOpen,
  onClose,
  exercise,
  exerciseDetails,
  isLoadingDetails = false,
  onSave
}: ExerciseAdminModalProps) => {
  const dispatch = useDispatch()
  const { muscles } = useSelector((s: RootState) => s.muscles)
  const { equipments } = useSelector((s: RootState) => s.equipments)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  tips: "",
    muscleIds: [] as number[],
    videoLinks: [] as string[],
    active: true,
    instructions: [] as string[],
    equipmentIds: [] as number[],
  })
  const [muscleOpen, setMuscleOpen] = useState(false)
  const [muscleSearch, setMuscleSearch] = useState("")
  const muscleRef = useRef<HTMLDivElement>(null)
  const [equipOpen, setEquipOpen] = useState(false)
  const [equipSearch, setEquipSearch] = useState("")
  const equipRef = useRef<HTMLDivElement>(null)
  const [errors, setErrors] = useState<{ name?: string; description?: string; muscles?: string; videos?: string; instructions?: string }>(() => ({}))

  const isEditing = !!exercise

  useEffect(() => {
    ;(dispatch as any)(fetchMuscles());
    ;(dispatch as any)(fetchEquipments());
  }, [dispatch])

  const muscleOptions = useMemo(() => muscles.map(m => ({ id: m.id, name: m.name })), [muscles])
  const equipmentOptions = useMemo(() => equipments.map(e => ({ id: e.id, name: e.name })), [equipments])

  // Close muscle dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (muscleRef.current && !muscleRef.current.contains(e.target as Node)) {
        setMuscleOpen(false)
      }
      if (equipRef.current && !equipRef.current.contains(e.target as Node)) {
        setEquipOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
  if (exercise) {
      // Base from lightweight exercise row
      setFormData((prev) => ({
        ...prev,
        name: exercise.name,
        description: exercise.description,
        active: exercise.status === 'active',
      }))
    } else {
      setFormData({
        name: "",
        description: "",
    tips: "",
        muscleIds: [],
        videoLinks: [],
        active: true,
        instructions: [""],
  equipmentIds: [],
      })
    }
  }, [exercise])

  // Hydrate from backend details when present
  useEffect(() => {
    if (exerciseDetails) {
      const instructionsArr = Object.entries(exerciseDetails.instructions || {})
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([, v]) => String(v))
      setFormData(prev => ({
        ...prev,
        name: exerciseDetails.name ?? prev.name,
        description: exerciseDetails.description ?? prev.description,
        tips: (exerciseDetails as any).tips ?? prev.tips,
        active: exerciseDetails.active ?? prev.active,
        muscleIds: (exerciseDetails.targetMuscles || []).map(m => m.id),
        videoLinks: exerciseDetails.sampleVideos || [],
        instructions: instructionsArr.length ? instructionsArr : (prev.instructions.length ? prev.instructions : [""]),
  equipmentIds: (exerciseDetails.equipment || []).map(eq => eq.id),
      }))
    }
  }, [exerciseDetails])

  const isValid = useMemo(() => {
    const hasName = formData.name.trim().length > 0
    const hasDesc = formData.description.trim().length > 0
    const hasMuscles = formData.muscleIds.length > 0
    const hasVideos = formData.videoLinks.filter(v => v && v.trim()).length > 0
    const hasInstr = formData.instructions.filter(i => i && i.trim()).length > 0
    return hasName && hasDesc && hasMuscles && hasVideos && hasInstr
  }, [formData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleMuscle = (id: number) => {
    setFormData(prev => {
      const exists = prev.muscleIds.includes(id)
      return {
        ...prev,
        muscleIds: exists ? prev.muscleIds.filter(x => x !== id) : [...prev.muscleIds, id]
      }
    })
  }
  const toggleEquip = (id: number) => {
    setFormData(prev => {
      const exists = prev.equipmentIds.includes(id)
      return {
        ...prev,
        equipmentIds: exists ? prev.equipmentIds.filter(x => x !== id) : [...prev.equipmentIds, id]
      }
    })
  }

  const handleAddVideoLink = () => {
    setFormData(prev => ({
      ...prev,
      videoLinks: [...prev.videoLinks, ""]
    }))
  }

  const handleUpdateVideoLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      videoLinks: prev.videoLinks.map((link, i) => i === index ? value : link)
    }))
  }

  const handleRemoveVideoLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videoLinks: prev.videoLinks.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    // Validaciones conforme DTO backend
    const nextErrors: { name?: string; description?: string; muscles?: string; videos?: string; instructions?: string } = {}
    if (!formData.name.trim()) nextErrors.name = 'El nombre es requerido'
    if (!formData.description.trim()) nextErrors.description = 'La descripción es requerida'
    if (formData.muscleIds.length === 0) nextErrors.muscles = 'Selecciona al menos un músculo'
    if (formData.videoLinks.filter(v => v && v.trim()).length === 0) nextErrors.videos = 'Agrega al menos 1 video'
    if (formData.instructions.filter(i => i && i.trim()).length === 0) nextErrors.instructions = 'Agrega al menos 1 instrucción'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSave(formData)
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
  <div className="relative bg-primary border border-white/20 rounded-lg w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
  <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-primary z-30">
          <h2 className="text-white text-lg font-semibold">
            {isEditing ? "Editar Ejercicio" : "Crear Ejercicio"}
          </h2>
          <button 
            onClick={onClose}
            className="text-quaternary hover:text-white transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoadingDetails && (
            <div className="mb-2 text-quaternary text-sm">Cargando detalles…</div>
          )}
          {/* Nombre */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ej: Vuelos laterales"
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
            />
            {errors.name && <p className="mt-1 text-red-400 text-xs">{errors.name}</p>}
          </div>

          {/* Equipamiento (dropdown multi-select) */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Equipamiento
            </label>
            <div ref={equipRef} className="relative">
              <button
                type="button"
                onClick={() => setEquipOpen(o => !o)}
                className={`w-full p-3 bg-tertiary border border-white/20 rounded-lg text-left flex items-center justify-between ${equipOpen ? 'ring-2 ring-white/20' : ''}`}
              >
                <span className="text-quaternary text-sm">
                  {formData.equipmentIds.length > 0 ? `${formData.equipmentIds.length} seleccionado(s)` : 'Selecciona equipamiento (opcional)'}
                </span>
                {equipOpen ? <LuChevronUp className="text-quaternary" /> : <LuChevronDown className="text-quaternary" />}
              </button>
              {equipOpen && (
                <div className="absolute z-10 mt-2 w-full bg-itemsCard border border-white/20 rounded-lg shadow-lg p-2">
                  <div className="relative mb-2">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-quaternary" size={16} />
                    <input
                      type="text"
                      value={equipSearch}
                      onChange={(e) => setEquipSearch(e.target.value)}
                      placeholder="Buscar equipamiento..."
                      className="w-full pl-8 pr-3 py-2 bg-tertiary border border-white/10 rounded text-sm text-white placeholder-quaternary"
                    />
                  </div>
                  <div className="max-h-48 overflow-auto grid grid-cols-1 gap-1">
                    {equipmentOptions
                      .filter(m => m.name.toLowerCase().includes(equipSearch.trim().toLowerCase()))
                      .map(eq => {
                        const selected = formData.equipmentIds.includes(eq.id)
                        return (
                          <button
                            key={eq.id}
                            type="button"
                            onClick={() => toggleEquip(eq.id)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selected ? 'bg-blue-500/10 text-blue-300' : 'hover:bg-white/5 text-quaternary'}`}
                          >
                            {eq.name}
                          </button>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
            {formData.equipmentIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.equipmentIds.map(id => {
                  const name = equipmentOptions.find(e => e.id === id)?.name || `#${id}`
                  return (
                    <span key={id} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      {name}
                      <button onClick={() => toggleEquip(id)} className="hover:text-blue-200"><LuX size={12} /></button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Músculos objetivo (dropdown multi-select) */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Músculos objetivo
            </label>
            <div ref={muscleRef} className="relative">
              <button
                type="button"
                onClick={() => setMuscleOpen(o => !o)}
                className={`w-full p-3 bg-tertiary border border-white/20 rounded-lg text-left flex items-center justify-between ${muscleOpen ? 'ring-2 ring-white/20' : ''}`}
              >
                <span className="text-quaternary text-sm">
                  {formData.muscleIds.length > 0 ? `${formData.muscleIds.length} seleccionado(s)` : 'Selecciona músculos'}
                </span>
                {muscleOpen ? <LuChevronUp className="text-quaternary" /> : <LuChevronDown className="text-quaternary" />}
              </button>
              {muscleOpen && (
                <div className="absolute z-10 mt-2 w-full bg-itemsCard border border-white/20 rounded-lg shadow-lg p-2">
                  <div className="relative mb-2">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-quaternary" size={16} />
                    <input
                      type="text"
                      value={muscleSearch}
                      onChange={(e) => setMuscleSearch(e.target.value)}
                      placeholder="Buscar músculo..."
                      className="w-full pl-8 pr-3 py-2 bg-tertiary border border-white/10 rounded text-sm text-white placeholder-quaternary"
                    />
                  </div>
                  <div className="max-h-48 overflow-auto grid grid-cols-1 gap-1">
                    {muscleOptions
                      .filter(m => m.name.toLowerCase().includes(muscleSearch.trim().toLowerCase()))
                      .map(m => {
                        const selected = formData.muscleIds.includes(m.id)
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => toggleMuscle(m.id)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selected ? 'bg-blue-500/10 text-blue-300' : 'hover:bg-white/5 text-quaternary'}`}
                          >
                            {m.name}
                          </button>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
            {errors.muscles && <p className="mt-2 text-red-400 text-xs">{errors.muscles}</p>}
            {formData.muscleIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.muscleIds.map(id => {
                  const name = muscleOptions.find(m => m.id === id)?.name || `#${id}`
                  return (
                    <span key={id} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      {name}
                      <button onClick={() => toggleMuscle(id)} className="hover:text-blue-200"><LuX size={12} /></button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Ingresa una descripción"
              rows={4}
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 resize-none"
            />
            {errors.description && <p className="mt-1 text-red-400 text-xs">{errors.description}</p>}
          </div>

          {/* Tips (opcional) */}
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Tips (opcional)
            </label>
            <textarea
              value={formData.tips}
              onChange={(e) => handleInputChange("tips", e.target.value)}
              placeholder="Consejos adicionales para el ejercicio"
              rows={3}
              className="w-full p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 resize-none"
            />
          </div>

          {/* Videos demostrativos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-white text-sm font-medium">
                Videos demostrativos
              </label>
              <button
                onClick={handleAddVideoLink}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
              >
                <LuPlus size={14} />
                Agregar
              </button>
            </div>

            <div className="space-y-3">
              {formData.videoLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => handleUpdateVideoLink(index, e.target.value)}
                    placeholder="Ingresa el enlace del video"
                    className="flex-1 p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
                  />
                  <button
                    onClick={() => handleRemoveVideoLink(index)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                  >
                    <LuX size={16} />
                  </button>
                </div>
              ))}
            </div>
            {errors.videos && <p className="mt-2 text-red-400 text-xs">{errors.videos}</p>}
          </div>

          {/* Instrucciones (lista tipo videos) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-white text-sm font-medium">Instrucciones</label>
              <button
                onClick={() => setFormData(prev => ({ ...prev, instructions: [...prev.instructions, ""] }))}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
              >
                <LuPlus size={14} />
                Agregar paso
              </button>
            </div>
            <div className="space-y-3">
              {formData.instructions.map((text, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      instructions: prev.instructions.map((x, i) => i === idx ? e.target.value : x)
                    }))}
                    placeholder={`Paso ${idx + 1}`}
                    className="flex-1 p-3 bg-tertiary border border-white/20 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
                  />
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      instructions: prev.instructions.filter((_, i) => i !== idx)
                    }))}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                  >
                    <LuX size={16} />
                  </button>
                </div>
              ))}
            </div>
            {errors.instructions && <p className="mt-2 text-red-400 text-xs">{errors.instructions}</p>}
          </div>

          {/* Estado (solo en edición) */}
          {isEditing && (
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Estado
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.active ? 'bg-green-500' : 'bg-red-500'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-white/10 sticky bottom-0 bg-primary">
          <Button
            isWhite={false}
            action={handleCancel}
            isWidthFull={true}
          >
            Cancelar
          </Button>
          <Button
            isWhite={true}
            action={handleSave}
            isBlocked={!isValid || isLoadingDetails}
            isWidthFull={true}
          >
            {isEditing ? "Editar Ejercicio" : "Crear Ejercicio"}
          </Button>
        </div>
      </div>
    </div>
  )
}