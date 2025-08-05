import type { ReactNode } from "react"

interface ButtonProps {
    isWhite?: boolean
    icon?: ReactNode
    iconPosition?: boolean //True = Derecha, False = Izquierda
    children: React.ReactNode
    isWidthFull?: boolean
    customPadding?: number 
}

export const Button = ({ isWhite = true, children, icon, isWidthFull, iconPosition = true, customPadding }: ButtonProps) => {

    const paddingClass = icon && customPadding ? `px-${customPadding} py-2` : "px-6 py-2"
    const widthClass = isWidthFull ? "" : "md:w-fit lg:w-fit xl:w-fit 2xl:w-fit"
    

    return (
        (isWhite ? <button className={`${widthClass} ${paddingClass} w-full rounded-lg bg-white font-semibold transition-colors text-primary flex justify-center items-center gap-2 cursor-pointer hover:bg-white/90`}>
            {icon && !iconPosition && <span className="text-lg">{icon}</span>}

            {children}

            {icon && iconPosition && <span className="text-lg">{icon}</span>}
        </button> : <button className={`${widthClass} ${paddingClass} w-full rounded-lg bg-black border border-white/30 font-medium  transition-colors text-white justify-center flex items-center gap-2 cursor-pointer hover:bg-primary`}>
            {icon && !iconPosition && <span className="text-lg">{icon}</span>}

            {children}
           
            {icon && iconPosition && <span className="text-lg">{icon}</span>}
        </button>)

    )
}
