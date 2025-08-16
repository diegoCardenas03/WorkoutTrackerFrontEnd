export const OurHistoryCard = () => {
  return (
    <div className="bg-tertiary py-10 px-4 sm:px-6 lg:px-8 rounded-lg border border-white/20">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold mb-8">
            Nuestra Historia
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-6 text-quaternary text-sm sm:text-base leading-relaxed">
          <p>
            WorkoutTracker nació en 2024 cuando nuestro fundador, trabajando como consultor tecnológico para gimnasios, se dio cuenta de que la 
            mayoría de los centros deportivos carecían de una herramienta integral que uniera la gestión administrativa hasta la experiencia del 
            miembro.
          </p>

          <p>
            Trabajamos directamente con dueños de gimnasios para entender sus necesidades reales: desde la gestión administrativa hasta la 
            creación de rutinas personalizadas. El resultado fue una plataforma integral que permitiera a los gimnasios modernos optimizar sus 
            operaciones mientras ofrecían una experiencia superior a sus miembros.
          </p>

          <p>
            Hoy, más de 200 gimnasios confían en FitApp para gestionar a sus miembros y optimizar sus operaciones. Nuestro enfoque sigue siendo el 
            mismo: entregar herramientas como dueños de cada gimnasio y proporcionar soluciones tecnológicas que realmente marquen la diferencia.
          </p>
        </div>
      </div>
    </div>
  )
}