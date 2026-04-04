'use client'

import { Stack, Text, HStack, Box } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from '@/components/ui/dialog'

import { Button } from '@chakra-ui/react'
import { LuFilter, LuChevronDown, LuChevronUp } from 'react-icons/lu'

import { SecurityItem } from './SecurityItem'
import { SecurityDetails } from './SecurityDetails'
import { SecurityFilters } from './SecurityFilters'
import SecurityForm from './SecurityForm'
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog'
import { useSecurityList } from '../hooks/useSecurityList'
import { INITIAL_FILTERS_SECURITY } from '../constants/INITIAL_FILTERS_SECURITY'
import { PaginationList } from '@/components/ui/PaginationList'
import { TableList } from '@/components/ui/TableList'

export default function SecurityList() {
  const {
    selectedId,
    setSelectedId,
    editingSecurity,
    setEditingSecurity,
    filters,
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
  } = useSecurityList(INITIAL_FILTERS_SECURITY)

  return (
    <Stack gap={4}>
      <HStack justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">
          Список сотрудников
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
        <Box
          p={4}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50/50"
          animation="fade-in 0.2s ease-out"
        >
          <SecurityFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </Box>
      )}
      <Stack gap={4} opacity={isLoading ? 0.6 : 1} transition="opacity 0.2s">
        <TableList
          isLoading={isLoading}
          items={securities}
          emptyText="Сотрудники не найдены"
          headers={[{ title: 'Сотрудник / Статус' }, { title: 'Действия', textAlign: 'end' }]}
          renderRow={(s) => (
            <SecurityItem
              key={s.id}
              security={s}
              onDetails={setSelectedId}
              onEdit={setEditingSecurity}
              setDeleteTarget={setDeleteTarget}
              setOpenDeleteDialog={setOpenDeleteDialog}
              isDeleting={isPending && deleteTarget === s.id}
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

      <ConfirmDeleteDialog
        onClose={() => setOpenDeleteDialog(false)}
        isOpen={openDeleteDialog}
        onConfirm={confirmDelete}
        isLoading={isPending}
      />
    </Stack>
  )
}
