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
    paddingLine?: string;
    mdPaddingLine?: string;
    lgPaddingLine?: string;
    mobileText?: string;
    customWidthMobile?: string
    isALike?: boolean
    onlyMobileText?: boolean
}

export const Button = ({ isWhite = true, children, icon, isWidthFull, iconPosition = true, mdHeight = "h-10", lgHeight = "h-12", mobileHeight = "h-10", action, isBold = false, isBlocked = false, paddingLine = "px-4", mdPaddingLine = "md:px-6", lgPaddingLine = "lg:px-7", mobileText = "text-[14px]", customWidthMobile = "", isALike = false, onlyMobileText = false }: ButtonProps) => {

    const widthClass = isWidthFull ? "w-full" : "md:w-fit lg:w-fit xl:w-fit 2xl:w-fit"
    const heightClass = `${mobileHeight} md:${mdHeight} lg:${lgHeight}`

    return (

        (isWhite ? <button disabled={isBlocked} onClick={action} className={`${widthClass} ${heightClass} ${paddingLine}  ${mdPaddingLine} ${lgPaddingLine}  rounded-lg ${isALike ? 'bg-[#FFCFCF]' : 'bg-white'}  ${isBold ? 'font-bold' : 'font-semibold'} transition-colors flex justify-center items-center gap-2 ${isBlocked
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : `${isALike ? 'text-[#7C0000] hover:bg-[#FFCFCF]/90' : 'text-primary hover:bg-white/90'}  cursor-pointer  `
            } ${mobileText} ${onlyMobileText ? 'md:text-[13px]' : 'md:text-[15px] lg:text-[15px]'}  `}>
            {icon && !iconPosition && <span className="text-lg">{icon}</span>}
            <div className={`${customWidthMobile} md:w-fit`}>
                {children}
            </div>


            {icon && iconPosition && <span className="text-lg">{icon}</span>}
        </button> :
            <button disabled={isBlocked} onClick={action} className={`${widthClass} ${heightClass} w-full ${paddingLine} ${mdPaddingLine} ${lgPaddingLine} rounded-lg bg-black border border-white/30 ${isBold ? 'font-bold' : 'font-semibold'}  transition-colors justify-center flex items-center gap-2 ${isBlocked
                ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                : 'bg-black border-white/30 text-white cursor-pointer hover:bg-primary'
                } ${mobileText} md:text-[15px] lg:text-[15px] `}>
                {icon && !iconPosition && <span className="text-lg">{icon}</span>}

                {children}

                {icon && iconPosition && <span className="text-lg">{icon}</span>}
            </button>)

    )
}
