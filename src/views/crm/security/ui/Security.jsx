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

export default function Security() {
  const [open, setOpen] = useState(false)

  return (
    <Box p={8} maxW="1600px" mx="auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Управление охраной</Heading>

        <Button colorPalette="blue" onClick={() => setOpen(true)}>
          + Добавить охранника
        </Button>
      </Flex>

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
    </Box>
  )
}
