import React from 'react'
import { Dialog, Button, Icon, Box, Text } from '@chakra-ui/react'
import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi'

export const ConfirmActionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Подтвердите действие',
  message = 'Вы уверены, что хотите выполнить это действие?',
  confirmText = 'Продолжить',
  cancelText = 'Отмена',
  isLoading = false,
  icon: ActionIcon = FiAlertTriangle,
  confirmButtonVariant = 'solid',
  confirmButtonColor = 'blue',
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content width="full" py={2} px={2}>
          <Box>
            <Dialog.Header display="flex" alignItems="center" gap={4}>
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
                bg={`${confirmButtonColor}.100`}
                p={4}
              >
                <Icon as={ActionIcon} boxSize={4} color={`${confirmButtonColor}.500`} />
              </Box>
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {title}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text color="gray.600">{message}</Text>
            </Dialog.Body>
          </Box>

          <Dialog.Footer gap={3}>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              <Icon as={FiX} /> {cancelText}
            </Button>

            <Button
              colorScheme={confirmButtonColor}
              variant={confirmButtonVariant}
              onClick={onConfirm}
              disabled={isLoading}
              loading={isLoading}
            >
              <Icon as={FiCheck} /> {confirmText}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
