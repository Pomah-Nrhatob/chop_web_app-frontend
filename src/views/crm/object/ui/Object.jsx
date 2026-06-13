'use client'

import { Box, Flex, Heading, Button } from '@chakra-ui/react'
import { useState } from 'react'
import ObjectForm from './ObjectForm'
import ObjectList from './ObjectList'
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

export default function Object() {
  const [open, setOpen] = useState(false)

  return (
    <ContainerForPage
      title="Объекты"
      text="Раздел для управления объектами в системе"
      actionComponent={
        <Button size={{ base: 'xs', md: 'sm' }} onClick={() => setOpen(true)}>
          <FiPlus /> Добавить объект
        </Button>
      }
    >
      <Box mt={4}>
        <ObjectList />
      </Box>

      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)} size="lg" placement="center">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Регистрация нового объекта</DialogTitle>
          </DialogHeader>

          <DialogBody pb={6}>
            <ObjectForm onSuccess={() => setOpen(false)} />
          </DialogBody>

          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </ContainerForPage>
  )
}
