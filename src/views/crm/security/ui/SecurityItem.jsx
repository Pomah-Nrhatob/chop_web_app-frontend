'use client'

import { DataTableRow } from '@/components/ui/DataTableRow'
import { Badge, Text } from '@chakra-ui/react'
import { memo } from 'react'
import { LuUser } from 'react-icons/lu'

export const SecurityItem = memo(
  ({ security, onDetails, onEdit, setDeleteTarget, setOpenDeleteDialog, isDeleting }) => {
    const { id, surname, name, patronymic, statusId, shiftSalary } = security

    return (
      <DataTableRow
        icon={LuUser}
        title={`${surname} ${name} ${patronymic}`}
        // ✅ Используем calendarHref вместо goToCalendar → сработает <Link> и loading bar
        calendarHref={`/bc/security/calendar/${id}`}
        onDetails={() => onDetails(id)}
        onEdit={() => onEdit(security)}
        onDelete={() => {
          setDeleteTarget(id)
          setOpenDeleteDialog(true)
        }}
        isDeleting={isDeleting}
        hideOnCalendarPage
        subContent={
          <>
            <Badge
              size="sm"
              variant="subtle"
              colorPalette={statusId === 1 ? 'green' : statusId === 2 ? 'orange' : 'red'}
            >
              {statusId === 1 ? 'Активен' : statusId === 2 ? 'Отпуск' : 'Уволен'}
            </Badge>
            <Text fontSize="xs" color="gray.500">
              {shiftSalary?.toLocaleString()} ₽ / смена
            </Text>
          </>
        }
      />
    )
  }
)
