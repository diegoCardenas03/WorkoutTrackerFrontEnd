import { Button } from "../../Button"

export const CallToActionCard = () => {
  const handleGetStarted = () => {
    // console.log("Iniciar transformación del gimnasio")
    // Aquí iría la lógica para redirigir o abrir modal de contacto
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-black text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
          ¿Listo para digitalizar tu gimnasio?
        </h2>

        {/* Subtitle */}
        <p className="text-black text-sm sm:text-base mb-8 max-w-2xl mx-auto">
          Únete a más de 200 gimnasios que ya transformaron su operación con WorkoutTracker
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            isWhite={false}
            action={handleGetStarted}
          >
            Solicita una demo para tu gimnasio
          </Button>
        </div>
      </div>
    </div>
  )
}