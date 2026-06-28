'use client'

import { Box, Button, Collapsible, HStack, Icon, Presence, Stack, VStack } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from '@/components/ui/dialog'
import { LuChevronDown, LuChevronUp, LuFilter } from 'react-icons/lu'

import { SecurityItem } from './SecurityItem'
import { SecurityDetails } from './SecurityDetails'
import { SecurityFilters } from './SecurityFilters'
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog'
import { useSecurityList } from '../hooks/useSecurityList'
import { INITIAL_FILTERS_SECURITY } from '../constants/INITIAL_FILTERS_SECURITY'
import { PaginationList } from '@/components/ui/PaginationList'
import { TableList } from '@/components/ui/TableList'
import SecurityDialog from '@/views/crm/security/ui/SecurityDialog'
import SecurityViewDialog from '@/views/crm/security/ui/SecurityViewDialog'

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
          maxH={showFilters ? '700px' : '0'}
          opacity={showFilters ? 1 : 0}
          shadow="md"
          borderRadius="xl"
        >
          <VStack bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="xl" p={4}>
            <SecurityFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </VStack>
        </Box>

        <VStack bg="white" borderRadius="xl" shadow="md" p={4} gap={4}>
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

      <SecurityViewDialog
        open={!!selectedId}
        security={selectedSecurity}
        onClose={() => setSelectedId(null)}
      />

      <SecurityDialog
        open={!!editingSecurity}
        onClose={() => setEditingSecurity(null)}
        security={editingSecurity}
      />

      <ConfirmDeleteDialog
        onClose={() => setOpenDeleteDialog(false)}
        isOpen={openDeleteDialog}
        onConfirm={confirmDelete}
        isLoading={isPending}
      />
    </>
  )
}
