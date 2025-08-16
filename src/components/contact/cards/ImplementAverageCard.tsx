import { LuFileText } from "react-icons/lu"

export const ImplementAverageCard = () => {
  return (
    <div className="bg-tertiary rounded-xl p-6 sm:p-8 border border-white/10 text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="">
          <LuFileText className="text-white" size={40} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white text-lg sm:text-xl font-semibold mb-4">
        Promedio de implementación
      </h3>

      {/* Time Range */}
      <div className="mb-4">
        <span className="text-white text-2xl sm:text-3xl font-bold">
          48-72 horas
        </span>
      </div>

      {/* Description */}
      <p className="text-quaternary text-sm sm:text-base">
        Desde la contratación hasta el lanzamiento
      </p>
    </div>
  )
}