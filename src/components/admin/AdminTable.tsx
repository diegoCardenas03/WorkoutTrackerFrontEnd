import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import type { ReactNode } from "react"

export interface Column<T> {
  key: string
  label: string
  width?: string // Por ejemplo: "col-span-2", "col-span-1"
  render?: (item: T, index: number) => ReactNode
  className?: string
}

export interface AdminTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
  totalItems: number
  itemName: string // Por ejemplo: "categoría", "músculo", "ejercicio"
  itemNamePlural?: string // Por ejemplo: "categorías", "músculos", "ejercicios"
}

export function AdminTable<T>({
  columns,
  data,
  emptyMessage = "No hay datos para mostrar.",
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
  itemName,
  itemNamePlural
}: AdminTableProps<T>) {
  
  const pluralName = itemNamePlural || `${itemName}s`
  const displayName = totalItems === 1 ? itemName : pluralName

  // Generar el estilo del grid basado en las columnas
  const gridTemplateColumns = columns.map(col => {
    if (col.width?.includes('col-span-')) {
      const span = col.width.match(/col-span-(\d+)/)?.[1] || '1'
      return `minmax(0, ${span}fr)`
    }
    return 'minmax(0, 1fr)'
  }).join(' ')

  return (
    <>
      {/* Table */}
      <div className="bg-tertiary rounded-lg border border-white/20 overflow-hidden">
        {/* Table Header */}
        <div 
          className="grid gap-4 p-4 border-b border-white/10 bg-itemsCard"
          style={{ gridTemplateColumns }}
        >
          {columns.map((column) => (
            <div 
              key={column.key} 
              className={`text-quaternary text-sm font-medium ${column.className || ''}`}
            >
              {column.label}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/10">
          {data.length === 0 && (
            <div className="p-6 text-quaternary text-sm">{emptyMessage}</div>
          )}
          {data.map((item, index) => (
            <div 
              key={index} 
              className="grid gap-4 p-4 items-center"
              style={{ gridTemplateColumns }}
            >
              {columns.map((column) => (
                <div 
                  key={column.key} 
                  className={column.className || ''}
                >
                  {column.render 
                    ? column.render(item, index)
                    : (item as any)[column.key]
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LuChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-white text-black'
                    : 'bg-tertiary border border-white/20 text-quaternary hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-tertiary border border-white/20 text-quaternary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LuChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Info de paginación */}
      {totalItems > 0 && (
        <div className="text-center mt-4">
          <p className="text-quaternary text-sm">
            Mostrando {startIndex + 1} - {Math.min(endIndex, totalItems)} de {totalItems} {displayName}
          </p>
        </div>
      )}
    </>
  )
}
