'use client'

import { ActionBar, Button, HStack, Portal, Text } from '@chakra-ui/react'
import { MdCalendarMonth } from 'react-icons/md'

export default function SecurityCalendarActionBar({
  selectedDates,
  onVacation,
  onAssign,
  onClear,
  isCreatingVacation = false,
}) {
  if (selectedDates.length === 0) return null

  return (
    <ActionBar.Root open={selectedDates.length > 0} closeOnInteractOutside={false}>
      <Portal>
        <ActionBar.Positioner style={{ zIndex: 500 }}>
          <ActionBar.Content
            bg="blue.900"
            color="white"
            borderRadius="xl"
            px={{ base: 3, md: 5 }}
            py={{ base: 2, md: 3 }}
            boxShadow="2xl"
            width={{ base: 'calc(100vw - 24px)', md: 'auto' }}
            maxW="700px"
            display="flex"
            flexDirection={{ base: 'column', sm: 'row' }}
            alignItems={{ base: 'stretch', sm: 'center' }}
            gap={{ base: 2, sm: 3 }}
          >
            <HStack flex="1" minW={0} gap={2}>
              <MdCalendarMonth />

              <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="medium">
                Выбрано дней: <b>{selectedDates.length}</b>
              </Text>
            </HStack>

            <ActionBar.Separator display={{ base: 'none', sm: 'block' }} />

            <HStack width={{ base: '100%', sm: 'auto' }} gap={2}>
              <Button
                flex={{ base: 1, sm: 'initial' }}
                colorPalette="blue"
                size={{ base: 'xs', md: 'sm' }}
                onClick={onAssign}
              >
                <Text as="span" display={{ base: 'none', sm: 'inline' }}>
                  Назначить смену
                </Text>

                <Text as="span" display={{ base: 'inline', sm: 'none' }}>
                  Смена
                </Text>
              </Button>

              <Button
                flex={{ base: 1, sm: 'initial' }}
                colorPalette="red"
                variant="solid"
                size={{ base: 'xs', md: 'sm' }}
                onClick={onClear}
              >
                <Text as="span" display={{ base: 'none', sm: 'inline' }}>
                  Очистить выбор
                </Text>

                <Text as="span" display={{ base: 'inline', sm: 'none' }}>
                  Очистить
                </Text>
              </Button>
            </HStack>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  )
}
