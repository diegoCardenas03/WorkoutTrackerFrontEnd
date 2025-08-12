
interface SubHeaderProps {
    nameView?: string
    description?: string
    children?: React.ReactNode
    containOptions?: boolean
}

export const SubHeader = ({containOptions = false, nameView = 'Mi Progreso', description = 'Analiza tu evolución y rendimiento', children} : SubHeaderProps) => {
  return (
    <div className="flex justify-between items-center w-full text-white">
        <div className="flex flex-col items-start">
            <h1 className="font-semibold text-[1.4em] md:text-[1.6em] lg:text-[1.8em]">{nameView}</h1>
            <p className="text-quaternary font-light text-[12px] md:text-[15px] lg:text-[1em]">{description}</p>
        </div>

        {/* Options */}

        {containOptions && (<div className="bg-itemsCard flex justify-between items-center w-[22em] h-[4em] md:w-[22em] md:h-[2.8em]   lg:w-[24em] lg:h-[3em] px-2 py-2 rounded-4xl font-semibold text-[8px] md:text-[14px] lg:text-[15px]">
            <div className="cursor-pointer hover:bg-primary rounded-4xl px-[6px] py-[3px] md:px-[14px] md:py-[7px] transition-all">Esta semana</div>
            <div className="cursor-pointer hover:bg-primary rounded-4xl px-[6px] py-[3px] md:px-[14px] md:py-[7px] transition-all">Este mes</div>
            <div className="cursor-pointer hover:bg-primary rounded-4xl px-[6px] py-[3px] md:px-[14px] md:py-[7px] transition-all">Este año</div>
        </div>)}

        {children && (<div>
            {children}
        </div>)}

    </div>
  )
}
