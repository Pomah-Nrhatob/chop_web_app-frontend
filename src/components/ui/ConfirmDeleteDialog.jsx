import React from 'react'
import { Dialog, Button, Icon, Box, Text, useColorModeValue } from '@chakra-ui/react'
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi'

export const ConfirmDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Подтвердите удаление',
  message = 'Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить.',
  confirmText = 'Удалить',
  cancelText = 'Отмена',
  isLoading = false,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content width="full" py={2} px={2}>
          <Box>
            <Dialog.Header display="flex" alignItems="center">
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
                bg="red.100"
                p={4}
              >
                <Icon as={FiAlertTriangle} boxSize={4} color="red.500" />
              </Box>
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {title}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text color="gray.600">{message}</Text>
            </Dialog.Body>
          </Box>

          <Dialog.Footer gap={3} flexDirection={{ base: 'column', sm: 'row' }}>
            <Button variant="outline" onClick={onClose} isDisabled={isLoading}>
              <Icon as={FiX} /> {cancelText}
            </Button>

            <Button colorScheme="red" onClick={onConfirm} isLoading={isLoading}>
              <Icon as={FiTrash2} /> {confirmText}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
