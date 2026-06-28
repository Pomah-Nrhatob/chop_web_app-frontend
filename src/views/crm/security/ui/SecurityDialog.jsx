import { Badge, Button, CloseButton, Dialog, Flex, HStack, Portal, Text } from '@chakra-ui/react'
import SecurityForm from './SecurityForm'
import { useSecurityForm } from '@/views/crm/security/hooks/useSecurityForm'

export default function SecurityDialog({ open, onClose, security }) {
  const form = useSecurityForm(onClose, security)

  const { isLoading, isEditing, resetForm } = form

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      initialFocusEl={null}
      scrollBehavior="inside"
      onExitComplete={() => resetForm()}
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
            display="flex"
            flexDirection="column"
          >
            <Dialog.Header flex="0 0 auto">
              <Flex direction="column" gap={2}>
                <Dialog.Title>
                  {security ? 'Редактирование сотрудника' : 'Создание сотрудника'}
                </Dialog.Title>

                <Badge colorPalette={security ? 'orange' : 'green'} alignSelf="flex-start">
                  {security ? 'Редактирование' : 'Новый сотрудник'}
                </Badge>

                <Text fontSize="sm" color="gray.600">
                  Заполните данные сотрудника.
                </Text>
              </Flex>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top={3} right={3} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body flex="1" overflowY="auto" overscrollBehavior="contain">
              <SecurityForm
                id="security-form"
                initialData={security}
                onSuccess={() => {
                  onClose()
                  resetForm()
                }}
                hideActions
                form={form}
              />
            </Dialog.Body>

            <Dialog.Footer flex="0 0 auto">
              <HStack justify="flex-end" w="100%">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  Отмена
                </Button>

                <Button
                  form="security-form"
                  type="submit"
                  // colorPalette={security ? 'orange' : 'blue'}
                  loading={isLoading}
                >
                  {security ? 'Сохранить' : 'Создать'}
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
