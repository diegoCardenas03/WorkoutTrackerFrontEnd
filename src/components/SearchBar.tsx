import { useState } from "react"
import { IoSearch, IoChevronDown } from "react-icons/io5"


interface SearchBarProps {
  placeholder?: string
  onSearch?: (value: string) => void
}

export const SearchBar = ({ 
  placeholder = "Buscar ejercicios...", 
  onSearch,
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    if (onSearch) {
      onSearch(e.target.value)
    }
  }


  return (
    <div className="rounded-lg w-full space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IoSearch className="h-5 w-5 text-quaternary" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="w-full h-10 2xl:h-12 pl-12 pr-4 bg-itemsCard  rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/40 transition-all text-sm md:text-base"
        />
      </div>

    </div>
  )
}