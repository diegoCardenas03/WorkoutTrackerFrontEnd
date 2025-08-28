import { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  name: string;
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  ignoreWidth?: boolean;
};

export const CustomSelect = ({
  name,
  options,
  defaultValue = "",
  onChange,
  className = "", ignoreWidth = false
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const selectRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mantener sincronizado cuando cambia defaultValue externamente
  useEffect(() => {
    setSelectedValue(defaultValue)
  }, [defaultValue])

  const selectedOption = options.find(opt => opt.value === selectedValue) || {
    value: "",
    label: name,
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Input visible - disparador del dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${ignoreWidth ? '' : 'xl:w-[15em]' } pl-4 pr-4 h-10 2xl:h-12 w-full   py-2 flex items-center justify-between
          bg-itemsCard rounded-lg text-sm md:text-base
          focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent
          transition-all duration-200 cursor-pointer ${isOpen ? "ring-2 ring-white/20 border-white/20" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-quaternary truncate">
          {selectedOption.label}
        </span>
        {isOpen ? (
          <IoChevronUp className="h-5 w-5 text-quaternary" />
        ) : (
          <IoChevronDown className="h-5 w-5 text-quaternary" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-10 w-full xl:w-[15em] mt-1 bg-itemsCard border border-white/20 rounded-lg 
          shadow-lg overflow-hidden transition-all duration-200"
          role="listbox"
        >
          <ul className="max-h-60 overflow-none">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-3 cursor-pointer transition-colors text-sm md:text-base
                  ${selectedValue === option.value ? "bg-primary/50 text-quaternary" : "hover:bg-linksNavbar text-quaternary"}`}
                role="option"
                aria-selected={selectedValue === option.value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input oculto para formularios */}
      <input type="hidden" name={name} value={selectedValue} />
    </div>
  );
};