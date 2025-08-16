interface WhyChoiceUsCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export const WhyChoiceUsCard = ({ 
  icon, 
  title, 
  description 
}: WhyChoiceUsCardProps) => {
  return (
    <div className="bg-tertiary text-center p-6 sm:p-8 rounded-lg border border-white/20">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white/10 rounded-xl">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white text-lg sm:text-xl font-semibold mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-quaternary text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </div>
  )
}