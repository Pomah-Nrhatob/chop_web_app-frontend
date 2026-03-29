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

import { useGetObjects } from '@/features/object/api/use-get-objects'
import { useDeleteObject } from '@/features/object/api/use-delete-object'
import { ObjectItem } from './ObjectItem'
import { ObjectDetails } from './ObjectDetails'
import { ObjectFilters } from './ObjectFilters'
import ObjectForm from './ObjectForm'

const INITIAL_FILTERS = {
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
}

export default function ObjectList() {
  const [selectedId, setSelectedId] = useState(null)
  const [editingObject, setEditingObject] = useState(null)
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  const { data: objects, isLoading } = useGetObjects(filters)
  const { mutate: deleteObject, isPending, variables } = useDeleteObject()

  const selectedObject = useMemo(
    () => objects?.find((s) => s.id === selectedId),
    [objects, selectedId]
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
      <ObjectFilters filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />

      <Stack gap={4}>
        {isLoading ? (
          <Text textAlign="center" py={10} color="gray.500">
            Загрузка данных...
          </Text>
        ) : objects?.length > 0 ? (
          objects.map((o) => (
            <ObjectItem
              key={o.id}
              object={o}
              onDelete={deleteObject}
              onDetails={setSelectedId}
              onEdit={setEditingObject}
              isDeleting={isPending && variables === o.id}
            />
          ))
        ) : (
          <Text textAlign="center" py={10} color="gray.400">
            Объекты не найдены
          </Text>
        )}
      </Stack>

      {/* 3. МОДАЛКА ПРОСМОТРА (ObjectDetails) */}
      <DialogRoot
        open={!!selectedId}
        onOpenChange={(e) => !e.open && setSelectedId(null)}
        size="md"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Карточка объекта</DialogTitle>
          </DialogHeader>
          <DialogBody pb={8}>
            <ObjectDetails object={selectedObject} />
          </DialogBody>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>

      {/* 4. МОДАЛКА РЕДАКТИРОВАНИЯ (ObjectForm) */}
      <DialogRoot
        open={!!editingObject}
        onOpenChange={(e) => !e.open && setEditingObject(null)}
        size="lg"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование данных</DialogTitle>
          </DialogHeader>
          <DialogBody pb={8}>
            <ObjectForm initialData={editingObject} onSuccess={() => setEditingObject(null)} />
          </DialogBody>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </Stack>
  )
}
