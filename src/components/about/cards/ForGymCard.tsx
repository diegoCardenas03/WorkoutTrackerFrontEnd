interface ForGymCardProps {
  icon: React.ReactNode
  title: string
  description: string

}

export const ForGymCard = ({ 
  icon, 
  title, 
  description, 
}: ForGymCardProps) => {
  return (
    <div className="bg-tertiary rounded-xl lg:w-[28em] 2xl:w-[35em] p-6 sm:p-8 border border-white/10">
      <div className="flex items-center gap-1 mb-6">
        <div className={`p-2 rounded-lg`}>
          {icon}
        </div>
        <h3 className="text-white text-xl sm:text-2xl font-semibold">
          {title}
        </h3>
      </div>
      
      <p className="text-quaternary text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </div>
  )
}