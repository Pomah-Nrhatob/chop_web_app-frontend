'use client'

import { Box, Button, Collapsible, HStack, Icon, Stack, VStack } from '@chakra-ui/react'
import { LuChevronDown, LuChevronUp, LuFilter } from 'react-icons/lu'
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
    <>
      <Stack gap={2}>
        <HStack justify="flex-end">
          <Button
            variant={showFilters ? 'solid' : 'outline'}
            colorPalette="blue"
            size="sm"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Icon>
              <LuFilter />
            </Icon>
            Фильтры
            <Icon
              transition="transform .2s"
              transform={showFilters ? 'rotate(180deg)' : 'rotate(0deg)'}
            >
              <LuChevronDown />
            </Icon>
          </Button>
        </HStack>

        <Box
          overflow="hidden"
          transition="max-height .25s ease, opacity .2s ease"
          maxH={showFilters ? '500px' : '0'}
          opacity={showFilters ? 1 : 0}
          shadow="md"
          borderRadius="xl"
        >
          <VStack bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="xl" p={4}>
            <ObjectFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </VStack>
        </Box>

        <VStack bg="white" borderRadius="xl" shadow="md" p={4} gap={4}>
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

          {totalPages > 1 && (
            <PaginationList
              totalItems={totalItems}
              limit={filters.limit}
              pageList={filters.page}
              handleFilterChange={handleFilterChange}
              totalPages={totalPages}
            />
          )}
        </VStack>
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
    </>
  )
}
