import { useDeleteSecurity } from '@/features/security/api/use-delete-security'
import { useGetSecurity } from '@/features/security/api/use-get-security'
import { useCallback, useMemo, useState } from 'react'

export const useSecurityList = (initialFilters) => {
  const [selectedId, setSelectedId] = useState(null)
  const [editingSecurity, setEditingSecurity] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const { data: response, isLoading } = useGetSecurity(filters) // Переименуем для ясности
  const securities = response?.data || [] // Данные теперь внутри .data
  const totalItems = response?.total || 0 // Общее количество
  const totalPages = Math.ceil(totalItems / filters.limit)

  const { mutate: deleteSecurity, isPending } = useDeleteSecurity(() => {
    setOpenDeleteDialog(false)
    setDeleteTarget(null)
  })

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteSecurity(deleteTarget)
    }
  }

  const selectedSecurity = useMemo(
    () => securities.find((s) => s.id === selectedId),
    [securities, selectedId]
  )

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => {
      if (key === 'page') {
        return { ...prev, page: value }
      }

      if (typeof value === 'object' && value !== null) {
        return { ...prev, ...value, page: 1 }
      }
      return { ...prev, [key]: value, page: 1 }
    })
  }, [])

  const resetFilters = useCallback(() => setFilters(initialFilters), [])

  return {
    selectedId,
    setSelectedId,
    editingSecurity,
    setEditingSecurity,
    filters,
    setFilters,
    openDeleteDialog,
    setOpenDeleteDialog,
    deleteTarget,
    setDeleteTarget,
    showFilters,
    setShowFilters,
    isLoading,
    securities,
    totalPages,
    totalItems,
    isPending,
    confirmDelete,
    selectedSecurity,
    handleFilterChange,
    resetFilters,
  }
}
