'use client'

import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import SecurityList from './SecurityList'

import ContainerForPage from '@/components/containerForPage/ContainerForPage'
import { FiPlus } from 'react-icons/fi'
import SecurityDialog from '@/views/crm/security/ui/SecurityDialog'

export default function Security() {
  const [open, setOpen] = useState(false)

  return (
    <ContainerForPage
      title="Сотрудники"
      text="Раздел для управления сотрудниками в системе"
      actionComponent={
        <Button size={{ base: 'xs', md: 'sm' }} onClick={() => setOpen(true)}>
          <FiPlus /> Добавить охранника
        </Button>
      }
    >
      <SecurityList />

      <SecurityDialog open={open} onClose={() => setOpen(false)} />
    </ContainerForPage>
  )
}
