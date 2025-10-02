import { TbTrendingUp } from "react-icons/tb"
import { Button } from "../../Button"
import { LuPlus } from "react-icons/lu"
import { useState } from "react"
import { WeightRegisterModal } from "../Modals/WeightRegisterModal"
import { useBodyWeight } from "../../../hooks/useBodyWeight"
import { Toast } from "../../Toast"

export const EvolutionCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const { bodyWeights, isLoading, addBodyWeight, refetch } = useBodyWeight()

   const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveWeight = async (weight: string) => {
    const success = await addBodyWeight(Number(weight))
    if (success) {
      await refetch()
      setShowToast(true)
    }
  }

  // Obtener últimos 6 registros de peso
  const weightData = bodyWeights
    .slice(-6) // Últimos 6 registros
    .map((peso, index) => ({
      month: `Reg ${index + 1}`,
      weight: peso.bodyWeight
    }))

  // Si no hay datos, mostrar mensaje
  if (isLoading) {
    return (
      <>
        <div className="bg-tertiary rounded-lg p-6 text-white w-full md:h-[36em] border border-white/20 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quaternary"></div>
        </div>
        <WeightRegisterModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveWeight}
        />
      </>
    )
  }

  if (weightData.length === 0) {
    return (
      <>
        <div className="bg-tertiary rounded-lg p-6 text-white w-full md:h-[36em] border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TbTrendingUp className="text-white" size={20} />
              <h3 className="text-white text-[15px] md:text-[1.2em] 2xl:text-[1.5em] font-medium">Evolución del peso</h3>
            </div>
            <Button 
              isWhite={true} 
              paddingLine="px-2"
              mdHeight="h-8"
              lgHeight="h-10"
              mobileHeight="h-8"
              mobileText="text-[11px]"
              iconPosition={false}
              icon={<LuPlus className="text-[12px]"/>}
              action={handleOpenModal}
            >
            Registrar peso
            </Button>
          </div>
          <div className="flex items-center justify-center h-[20em]">
            <div className="text-center">
              <p className="text-white/60 text-lg mb-2">Sin registros de peso</p>
              <p className="text-quaternary text-sm">Registra tu primer peso para ver tu evolución</p>
            </div>
          </div>
        </div>
        <WeightRegisterModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveWeight}
        />
      </>
    )
  }

  // Calcular posiciones basadas en datos reales
  const minWeight = Math.min(...weightData.map(d => d.weight))
  const maxWeight = Math.max(...weightData.map(d => d.weight))
  // Si solo hay un registro, usar un rango artificial para evitar división por 0
  const weightRange = maxWeight - minWeight || 10
  
  const chartHeight = 200
  const chartWidth = 600
  const padding = { top: 20, right: 40, bottom: 40, left: 40 }
  
  const getYPosition = (weight: number) => {
    if (weightRange === 10 && maxWeight === minWeight) {
      // Si solo hay un peso, centrarlo en el gráfico
      return chartHeight / 2
    }
    const ratio = (maxWeight - weight) / weightRange
    return ratio * (chartHeight - padding.top - padding.bottom) + padding.top
  }

  const getXPosition = (index: number) => {
    if (weightData.length === 1) {
      // Si solo hay un registro, centrarlo horizontalmente
      return chartWidth / 2
    }
    return (index / (weightData.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left
  }

  return (
    <>
    
    <div className="bg-tertiary rounded-lg p-6 text-white w-full md:h-[36em] border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TbTrendingUp className="text-white" size={20} />
          <h3 className="text-white text-[15px] md:text-[1.2em] 2xl:text-[1.5em] font-medium">Evolución del peso</h3>
        </div>
        <Button 
          isWhite={true} 
          paddingLine="px-2"
          mdHeight="h-8"
          lgHeight="h-10"
          mobileHeight="h-8"
          mobileText="text-[11px]"
          iconPosition={false}
          icon={<LuPlus className="text-[12px]"/>}
          action={handleOpenModal}
        >
        Registrar peso
        </Button>
      </div>

      {/* Gráfico */}
      <div className="relative w-full h-[15em] md:h-[28em]" >
        {/* Grid lines horizontales */}
        <div className="absolute inset-0 flex flex-col justify-between py-5">
          {[maxWeight, maxWeight - weightRange * 0.25, maxWeight - weightRange * 0.5, maxWeight - weightRange * 0.75, minWeight].map((value, i) => (
            <div key={i} className="relative">
              <div className="absolute left-8 right-4 border-t border-gray-600/20"></div>
              <span className="absolute left-0 text-xs text-quaternary -translate-y-2">
                {value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        {/* SVG para la línea y puntos */}
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Línea de tendencia */}
          <polyline
            fill="none"
            stroke="#60A5FA"
            strokeWidth="2"
            points={weightData.map((data, index) => {
              const x = getXPosition(index)
              const y = getYPosition(data.weight)
              return `${x},${y}`
            }).join(' ')}
            className="drop-shadow-sm"
          />
          
          {/* Puntos */}
          {weightData.map((data, index) => {
            const x = getXPosition(index)
            const y = getYPosition(data.weight)
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#60A5FA"
                stroke="#1e293b"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            )
          })}
        </svg>

        {/* Etiquetas del eje X */}
        <div className="absolute bottom-0 left-10 right-10 flex justify-between text-xs text-quaternary">
          {weightData.map((data) => (
            <span key={data.month} className="text-center">{data.month}</span>
          ))}
        </div>
      </div>
    </div>
    <WeightRegisterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveWeight}
      />
    <Toast
      open={showToast}
      type="success"
      message="Peso registrado exitosamente"
      onClose={() => setShowToast(false)}
      durationMs={3000}
    />
    </>
  )
}