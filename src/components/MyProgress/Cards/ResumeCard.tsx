export const ResumeCard = () => {
  return (
    <div className="bg-tertiary rounded-lg p-6 pb-12 text-white w-full border border-white/20">
      {/* Header */}
      <h3 className="text-white text-[15px] md:text-[1.2em] 2xl:text-[1.5em] font-medium mb-8">Resumen del progreso</h3>
      
      {/* Estadísticas */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:px-30 lg:px-50">
        {/* Peso perdido */}
        <div className="text-center">
          <div className="text-green-400 md:text-[1.3em] lg:text-[1.5em] font-bold mb-1">-3.5kg</div>
          <div className="text-quaternary text-sm">Peso perdido</div>
        </div>
        
        {/* Entrenamientos completados */}
        <div className="text-center">
          <div className="text-blue-400 md:text-[1.3em] lg:text-[1.5em] font-bold mb-1">28</div>
          <div className="text-quaternary text-sm">Entrenamientos completados</div>
        </div>
      </div>
    </div>
  )
}