'use client'

import { DataTableRow } from '@/components/ui/DataTableRow'
import { useRouter } from 'next/navigation'
import { memo } from 'react'
import { LuBuilding2 } from 'react-icons/lu'

export const ObjectItem = memo(
  ({ object, onDetails, onEdit, setDeleteTarget, setOpenDeleteDialog, isDeleting }) => {
    const router = useRouter()
    function toCalendarPage() {
      router.push(`/bc/object/calendar/${object.id}`)
    }
    return (
      <DataTableRow
        icon={LuBuilding2}
        title={object.title}
        goToCalendar={toCalendarPage}
        onDetails={() => onDetails(object.id)}
        onEdit={() => onEdit(object)}
        onDelete={() => {
          setDeleteTarget(object.id)
          setOpenDeleteDialog(true)
        }}
        isDeleting={isDeleting}
      />
    )
  }
)
