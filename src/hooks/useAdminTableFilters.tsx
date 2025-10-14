import { useState, useMemo } from 'react'

interface ItemWithDates {
  active?: boolean
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export const useAdminTableFilters = <T extends ItemWithDates>(items: T[]) => {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('none')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredAndSorted = useMemo(() => {
    let result = [...items]

    // Filtro por estado activo/inactivo
    if (activeFilter === 'active') {
      result = result.filter(item => item.active === true)
    } else if (activeFilter === 'inactive') {
      result = result.filter(item => item.active === false)
    }

    // Ordenamiento por fecha
    if (dateFilter === 'created' && result[0]?.createdAt) {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
    } else if (dateFilter === 'updated' && result[0]?.updatedAt) {
      result.sort((a, b) => {
        const dateA = new Date(a.updatedAt || 0).getTime()
        const dateB = new Date(b.updatedAt || 0).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
    }

    return result
  }, [items, activeFilter, dateFilter, sortOrder])

  const clearFilters = () => {
    setActiveFilter('all')
    setDateFilter('none')
    setSortOrder('desc')
  }

  const hasActiveFilters = activeFilter !== 'all' || dateFilter !== 'none'

  return {
    activeFilter,
    setActiveFilter,
    dateFilter,
    setDateFilter,
    sortOrder,
    setSortOrder,
    filteredAndSorted,
    clearFilters,
    hasActiveFilters
  }
}
