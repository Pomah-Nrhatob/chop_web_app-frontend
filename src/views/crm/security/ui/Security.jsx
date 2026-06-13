'use client'

import { Box, Flex, Heading, Button } from '@chakra-ui/react'
import { useState } from 'react'
import SecurityForm from './SecurityForm'
import SecurityList from './SecurityList'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import ContainerForPage from '@/components/containerForPage/ContainerForPage'
import { FiPlus } from 'react-icons/fi'

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
      <Box mt={4}>
        <SecurityList />
      </Box>

      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)} size="lg" placement="center">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Регистрация нового сотрудника</DialogTitle>
          </DialogHeader>

          <DialogBody pb={6}>
            <SecurityForm onSuccess={() => setOpen(false)} />
          </DialogBody>

          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </ContainerForPage>
  )
}
