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
    isBold?: boolean
    isBlocked?: boolean
    action?: () => void;
}

export const Button = ({ isWhite = true, children, icon, isWidthFull, iconPosition = true, mdHeight = "h-12", lgHeight = "h-12", mobileHeight = "h-10", action, isBold = false, isBlocked = true }: ButtonProps) => {


    const widthClass = isWidthFull ? "" : "md:w-fit lg:w-fit xl:w-fit 2xl:w-fit"
    const heightClass = `${mobileHeight} md:${mdHeight} lg:${lgHeight}`




    return (
        (isWhite ? <button disabled={isBlocked} onClick={action} className={`${widthClass} ${heightClass} w-full rounded-lg bg-white ${isBold ? 'font-bold' : 'font-semibold'} transition-colors flex justify-center items-center gap-2 ${isBlocked
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-primary cursor-pointer hover:bg-white/90'
            } text-[14px] md:text-[15px] lg:text-[15px] px-6`}>
            {icon && !iconPosition && <span className="text-lg">{icon}</span>}

            {children}

            {icon && iconPosition && <span className="text-lg">{icon}</span>}
        </button> : <button disabled={isBlocked} onClick={action} className={`${widthClass} ${heightClass} w-full rounded-lg bg-black border border-white/30 ${isBold ? 'font-bold' : 'font-semibold'}  transition-colors justify-center flex items-center gap-2 ${isBlocked
                ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                : 'bg-black border-white/30 text-white cursor-pointer hover:bg-primary'
            } text-[14px] md:text-[15px] lg:text-[15px] px-6`}>
            {icon && !iconPosition && <span className="text-lg">{icon}</span>}

            {children}

            {icon && iconPosition && <span className="text-lg">{icon}</span>}
        </button>)

    )
}
