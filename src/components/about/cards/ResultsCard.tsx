export const ResultsCard = () => {
  const results = [
    {
      number: "200+",
      description: "Gimnasios activos"
    },
    {
      number: "50,000+",
      description: "Miembros gestionados"
    },
    {
      number: "98%",
      description: "Satisfacción de gimnasios"
    },
    {
      number: "24/7",
      description: "Soporte técnico"
    }
  ]

  return (
    <div className="bg-tertiary py-12 px-4 sm:px-6 lg:px-8 rounded-lg border border-white/20">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-white text-2xl font-semibold mb-2">
            Resultados comprobados
          </h2>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {results.map((result, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <h3 className="text-white text-3xl  font-bold">
                  {result.number}
                </h3>
              </div>
              <p className="text-quaternary text-sm sm:text-base">
                {result.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}