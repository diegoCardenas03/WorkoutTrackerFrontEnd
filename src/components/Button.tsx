import type { ReactNode } from "react"

interface ButtonProps {
    isWhite?: boolean
    icon?: ReactNode
    iconPosition?: boolean //True = Derecha, False = Izquierda
    children: React.ReactNode
    isWidthFull?: boolean
    mdHeight?: string
    lgHeight?: string
    mobileHeight?: string
    action?: () => void;
}

export const Button = ({ isWhite = true, children, icon, isWidthFull, iconPosition = true, mdHeight = "h-12", lgHeight = "h-12", mobileHeight = "h-10" , action }: ButtonProps) => {


    const widthClass = isWidthFull ? "" : "md:w-fit lg:w-fit xl:w-fit 2xl:w-fit"
    const heightClass = `${mobileHeight} md:${mdHeight} lg:${lgHeight}`




    return (
        (isWhite ? <button onClick={action} className={`${widthClass} ${heightClass} w-full rounded-lg bg-white font-semibold transition-colors text-primary flex justify-center items-center gap-2 cursor-pointer hover:bg-white/90 text-[14px] md:text-[16px] lg:text-[16px] px-6`}>
            {icon && !iconPosition && <span className="text-lg">{icon}</span>}

            {children}

            {icon && iconPosition && <span className="text-lg">{icon}</span>}
        </button> : <button onClick={action} className={`${widthClass} ${heightClass} w-full rounded-lg bg-black border border-white/30 font-medium  transition-colors text-white justify-center flex items-center gap-2 cursor-pointer hover:bg-primary text-[14px] md:text-[16px] lg:text-[16px] px-6`}>
            {icon && !iconPosition && <span className="text-lg">{icon}</span>}

            {children}

            {icon && iconPosition && <span className="text-lg">{icon}</span>}
        </button>)

    )
}
