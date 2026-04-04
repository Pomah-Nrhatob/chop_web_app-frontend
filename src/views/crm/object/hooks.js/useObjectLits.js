import { useDeleteObject } from '@/features/object/api/use-delete-object'
import { useGetObjects } from '@/features/object/api/use-get-objects'
import { useCallback, useMemo, useState } from 'react'

export const useObjectList = (initialFilters) => {
  const [selectedId, setSelectedId] = useState(null)
  const [editingObject, setEditingObject] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { mutate: deleteObject, isPending } = useDeleteObject(() => {
    setOpenDeleteDialog(false)
    setDeleteTarget(null)
  })

  const [filters, setFilters] = useState(initialFilters)

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteObject(deleteTarget)
    }
  }

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => {
      if (typeof key === 'object' && key !== null) {
        return { ...prev, ...key, page: 1 }
      }

      if (key === 'page') {
        return { ...prev, page: value }
      }

      return { ...prev, [key]: value, page: 1 }
    })
  }, [])

  const { data: response, isLoading } = useGetObjects(filters)
  const objects = response?.data || []
  const totalItems = response?.total || 0
  const totalPages = Math.ceil(totalItems / filters.limit)

  const resetFilters = useCallback(() => setFilters(initialFilters), [])

  const selectedObject = useMemo(
    () => objects.find((o) => o.id === selectedId),
    [objects, selectedId]
  )
  return {
    selectedId,
    setSelectedId,
    editingObject,
    setEditingObject,
    openDeleteDialog,
    setOpenDeleteDialog,
    showFilters,
    setShowFilters,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isPending,
    filters,
    setFilters,
    resetFilters,
    handleFilterChange,
    isLoading,
    objects,
    totalItems,
    totalPages,
    selectedObject,
  }
}
