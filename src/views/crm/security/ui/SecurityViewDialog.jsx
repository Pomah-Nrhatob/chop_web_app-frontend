'use client'

import { Badge, CloseButton, Dialog, Flex, Portal, Text } from '@chakra-ui/react'
import { SecurityDetails } from './SecurityDetails'

export default function SecurityViewDialog({ open, onClose, security }) {
  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner
          alignItems={{ base: 'flex-start', md: 'center' }}
          justifyContent="center"
          pt={{ base: 2, md: 0 }}
          px={{ base: 2, md: 0 }}
        >
          <Dialog.Content
            w={{ base: 'calc(100vw - 16px)', md: '700px' }}
            maxW="700px"
            maxH={{ base: 'calc(100dvh - 72px)', md: '90dvh' }}
            overflow="hidden"
          >
            <Dialog.Header>
              <Flex direction="column" gap={2}>
                <Dialog.Title>Карточка сотрудника</Dialog.Title>

                <Text fontSize="sm" color="gray.600">
                  Информация о сотруднике.
                </Text>
              </Flex>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top={3} right={3} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body overflowY="auto" overscrollBehavior="contain">
              <SecurityDetails security={security} />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
