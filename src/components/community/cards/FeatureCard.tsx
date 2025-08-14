interface FeatureCardProps {
    icon: React.ReactNode
    title: string
    value: string | number
    className?: string

}

export const FeatureCard = ({
    icon,
    title,
    value,
    className = "",

}: FeatureCardProps) => {


    return (
        <div className={`bg-tertiary rounded-lg border border-white/10 p-4 w-full ${className}`}>
            <div className="flex items-center gap-3">
                {icon}
                <div>
                    <p className="text-quaternary text-[12px] md:text-sm">{title}</p>
                    <p className="text-white text-[14px] md:text-lg font-semibold">{value}</p>
                </div>
            </div>
        </div>
    )
}
