import { DataTableRow } from '@/components/ui/DataTableRow'
import { Badge, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { memo } from 'react'
import { LuUser } from 'react-icons/lu'

export const SecurityItem = memo(
  ({ security, onDetails, onEdit, setDeleteTarget, setOpenDeleteDialog, isDeleting }) => {
    const { id, surname, name, patronymic, statusId, shiftSalary } = security
    const router = useRouter()
    function toCalendarPage() {
      router.push(`/bc/security/calendar/${security.id}`)
    }
    return (
      <DataTableRow
        icon={LuUser}
        goToCalendar={toCalendarPage}
        title={`${surname} ${name} ${patronymic}`}
        onDetails={() => onDetails(id)}
        onEdit={() => onEdit(security)}
        onDelete={() => {
          setDeleteTarget(id)
          setOpenDeleteDialog(true)
        }}
        isDeleting={isDeleting}
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
