import { LuFilter, LuX } from "react-icons/lu"
import { CustomSelect } from "../CustomSelect"

export interface FilterConfig {
  showActiveFilter?: boolean
  showDateFilters?: boolean
  customFilters?: {
    label: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
    value: string
  }[]
}

interface AdminTableFiltersProps {
  config: FilterConfig
  activeFilter: string
  onActiveFilterChange: (value: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (value: 'asc' | 'desc') => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export const AdminTableFilters = ({
  config,
  activeFilter,
  onActiveFilterChange,
  dateFilter,
  onDateFilterChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
  hasActiveFilters
}: AdminTableFiltersProps) => {
  const activeOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Solo activos' },
    { value: 'inactive', label: 'Solo inactivos' }
  ]

  const dateOptions = [
    { value: 'none', label: 'Sin ordenar' },
    { value: 'created', label: 'Fecha de creación' },
    { value: 'updated', label: 'Fecha de actualización' }
  ]

  const sortOptions = [
    { value: 'desc', label: 'Más reciente primero' },
    { value: 'asc', label: 'Más antiguo primero' }
  ]

  return (
    <div className="bg-itemsCard rounded-lg border border-white/10 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LuFilter className="text-quaternary" size={18} />
          <h3 className="text-white text-sm font-medium">Filtros</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary text-quaternary hover:text-white text-xs font-medium transition-colors border border-white/10"
          >
            <LuX size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro de Estado Activo/Inactivo */}
        {config.showActiveFilter !== false && (
          <div>
            <label className="text-quaternary text-xs mb-2 block">Estado</label>
            <CustomSelect
              name="Estado"
              options={activeOptions}
              defaultValue={activeFilter}
              onChange={onActiveFilterChange}
            />
          </div>
        )}

        {/* Filtro de Fecha */}
        {config.showDateFilters !== false && (
          <div>
            <label className="text-quaternary text-xs mb-2 block">Ordenar por</label>
            <CustomSelect
              name="Ordenar por"
              options={dateOptions}
              defaultValue={dateFilter}
              onChange={onDateFilterChange}
            />
          </div>
        )}

        {/* Orden Ascendente/Descendente (solo si hay filtro de fecha activo) */}
        {config.showDateFilters !== false && dateFilter !== 'none' && (
          <div>
            <label className="text-quaternary text-xs mb-2 block">Orden</label>
            <CustomSelect
              name="Orden"
              options={sortOptions}
              defaultValue={sortOrder}
              onChange={(value) => onSortOrderChange(value as 'asc' | 'desc')}
            />
          </div>
        )}

        {/* Filtros personalizados */}
        {config.customFilters?.map((filter, index) => (
          <div key={index}>
            <label className="text-quaternary text-xs mb-2 block">{filter.label}</label>
            <CustomSelect
              name={filter.label}
              options={filter.options}
              defaultValue={filter.value}
              onChange={filter.onChange}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
