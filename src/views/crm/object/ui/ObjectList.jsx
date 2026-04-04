'use client'

import { Stack, Text, HStack, Box, Button } from '@chakra-ui/react'
import { LuFilter, LuChevronDown, LuChevronUp } from 'react-icons/lu'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from '@/components/ui/dialog'

import { ObjectItem } from './ObjectItem'
import { ObjectDetails } from './ObjectDetails'
import { ObjectFilters } from './ObjectFilters'
import ObjectForm from './ObjectForm'
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog'
import { useObjectList } from '../hooks.js/useObjectLits'
import { INITIAL_FILTERS_OBJECTS } from '../constants/INITIAL_FILTERS_OBJECTS'
import { PaginationList } from '@/components/ui/PaginationList'
import { TableList } from '@/components/ui/TableList'

export default function ObjectList() {
  const {
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
    resetFilters,
    handleFilterChange,
    isLoading,
    objects,
    totalItems,
    totalPages,
    selectedObject,
  } = useObjectList(INITIAL_FILTERS_OBJECTS)

  return (
    <Stack gap={4}>
      <HStack justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">
          Объекты охраны
        </Text>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<LuFilter />}
        >
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          {showFilters ? <LuChevronUp /> : <LuChevronDown />}
        </Button>
      </HStack>

      {showFilters && (
        <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50/50">
          <ObjectFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </Box>
      )}

      <Stack gap={4} opacity={isLoading ? 0.6 : 1} transition="opacity 0.2s">
        <TableList
          isLoading={isLoading}
          items={objects}
          emptyText="Объекты не найдены"
          headers={[{ title: 'Название объекта' }, { title: 'Действия', textAlign: 'end' }]}
          renderRow={(o) => (
            <ObjectItem
              key={o.id}
              object={o}
              onDetails={setSelectedId}
              onEdit={setEditingObject}
              setDeleteTarget={setDeleteTarget}
              setOpenDeleteDialog={setOpenDeleteDialog}
              isDeleting={isPending && deleteTarget === o.id}
            />
          )}
        />

        <PaginationList
          totalItems={totalItems}
          limit={filters.limit}
          pageList={filters.page}
          handleFilterChange={handleFilterChange}
          totalPages={totalPages}
        />
      </Stack>

      <DialogRoot open={!!selectedId} onOpenChange={(e) => !e.open && setSelectedId(null)}>
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

      <DialogRoot open={!!editingObject} onOpenChange={(e) => !e.open && setEditingObject(null)}>
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

      <ConfirmDeleteDialog
        onClose={() => setOpenDeleteDialog(false)}
        isOpen={openDeleteDialog}
        onConfirm={confirmDelete}
        isLoading={isPending}
      />
    </Stack>
  )
}
