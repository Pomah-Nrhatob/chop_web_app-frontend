'use client'

import { useMemo, useState, useCallback } from 'react'
import { Stack, Text } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from '@/components/ui/dialog'

import { useGetSecurity } from '@/features/security/api/use-get-security'
import { useDeleteSecurity } from '@/features/security/api/use-delete-security'
import { SecurityItem } from './SecurityItem'
import { SecurityDetails } from './SecurityDetails'
import { SecurityFilters } from './SecurityFilters'
import SecurityForm from './SecurityForm'

export const INITIAL_FILTERS = {
  search: '',
  hasLicense: '',
  maxShiftSalary: '',
  statusId: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
}

export default function SecurityList() {
  const [selectedId, setSelectedId] = useState(null)
  const [editingSecurity, setEditingSecurity] = useState(null)
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  const { data: securities, isLoading } = useGetSecurity(filters)
  const { mutate: deleteSecurity, isPending, variables } = useDeleteSecurity()

  const selectedSecurity = useMemo(
    () => securities?.find((s) => s.id === selectedId),
    [securities, selectedId]
  )

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => {
      if (typeof value === 'object' && value !== null) {
        return { ...prev, ...value, page: 1 }
      }

      return { ...prev, [key]: value, page: 1 }
    })
  }, [])

  const resetFilters = useCallback(() => setFilters(INITIAL_FILTERS), [])

  return (
    <Stack gap={6}>
      <SecurityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      <Stack gap={4}>
        {isLoading ? (
          <Text textAlign="center" py={10} color="gray.500">
            Загрузка данных...
          </Text>
        ) : securities?.length > 0 ? (
          securities.map((s) => (
            <SecurityItem
              key={s.id}
              security={s}
              onDelete={deleteSecurity}
              onDetails={setSelectedId}
              onEdit={setEditingSecurity}
              isDeleting={isPending && variables === s.id}
            />
          ))
        ) : (
          <Text textAlign="center" py={10} color="gray.400">
            Сотрудники не найдены
          </Text>
        )}
      </Stack>

      {/* 3. МОДАЛКА ПРОСМОТРА (SecurityDetails) */}
      <DialogRoot
        open={!!selectedId}
        onOpenChange={(e) => !e.open && setSelectedId(null)}
        size="md"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Карточка сотрудника</DialogTitle>
          </DialogHeader>
          <DialogBody pb={8}>
            <SecurityDetails security={selectedSecurity} />
          </DialogBody>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>

      {/* 4. МОДАЛКА РЕДАКТИРОВАНИЯ (SecurityForm) */}
      <DialogRoot
        open={!!editingSecurity}
        onOpenChange={(e) => !e.open && setEditingSecurity(null)}
        size="lg"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование данных</DialogTitle>
          </DialogHeader>
          <DialogBody pb={8}>
            <SecurityForm
              initialData={editingSecurity}
              onSuccess={() => setEditingSecurity(null)}
            />
          </DialogBody>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </Stack>
  )
}
