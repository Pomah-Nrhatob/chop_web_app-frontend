'use client'

import { DataTableRow } from '@/components/ui/DataTableRow'
import { memo } from 'react'
import { LuBuilding2 } from 'react-icons/lu'

export const ObjectItem = memo(
  ({ object, onDetails, onEdit, setDeleteTarget, setOpenDeleteDialog, isDeleting }) => {
    return (
      <DataTableRow
        icon={LuBuilding2}
        title={object.title}
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
