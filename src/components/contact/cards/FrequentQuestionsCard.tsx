import { useState } from "react"
import { LuChevronDown, LuChevronUp } from "react-icons/lu"

interface FAQ {
  question: string
  answer: string
}

export const FrequentQuestionsCard = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQ[] = [
    {
      question: "¿Cuánto tiempo toma implementar WorkoutTracker en mi gimnasio?",
      answer: "La implementación típica toma entre 48-72 horas. Incluye configuración, migración de datos básicos y capacitación del personal."
    },
    {
      question: "¿Ofrecen período de prueba gratuito?",
      answer: "Sí, ofrecemos 30 días de prueba gratuita para que puedas evaluar completamente la plataforma con datos reales de tu gimnasio."
    },
    {
      question: "¿Cómo se maneja la marca de mi gimnasio en la app?",
      answer: "La app se personaliza completamente con los colores, logo y nombre de tu gimnasio. Tus miembros verán tu marca, no la nuestra."
    },
    {
      question: "¿Qué incluye el soporte técnico?",
      answer: "Soporte 24/7 vía chat y email, actualizaciones automáticas, capacitación continua y un gerente de cuenta dedicado."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-tertiary rounded-xl p-6 sm:p-8 border border-white/10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-white text-xl sm:text-2xl font-semibold">
          Preguntas Frecuentes
        </h2>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className=" rounded-lg overflow-hidden"
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full p-4 text-left transition-colors flex items-center justify-between"
            >
              <span className="text-white font-medium text-sm sm:text-base pr-4">
                {faq.question}
              </span>
              <div className="flex-shrink-0">
                {openIndex === index ? (
                  <LuChevronUp className="text-quaternary" size={20} />
                ) : (
                  <LuChevronDown className="text-quaternary" size={20} />
                )}
              </div>
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div className="p-4 border-white/20  border-t ">
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}