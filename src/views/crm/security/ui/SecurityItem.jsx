'use client'

import { memo } from 'react'
import { Card, Flex, Box, Text, Badge, IconButton, HStack } from '@chakra-ui/react'
import { LuTrash2, LuInfo, LuPencil } from 'react-icons/lu'

export const SecurityItem = memo(({ security, isDeleting, onDelete, onDetails, onEdit }) => {
  const { id, surname, name, statusId, shiftSalary } = security

  return (
    <Card.Root
      variant="outline"
      p={4}
      _hover={{ borderColor: 'blue.100', bg: 'blue.50/30' }} // Легкий подсвет при наведении
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="center">
        <Box flex="1">
          <Text fontWeight="bold" fontSize="xl" mb={2}>
            {surname} {name}
          </Text>

          <Flex gap={2} wrap="wrap" align="center">
            <Badge variant="subtle" colorPalette={statusId === 1 ? 'green' : 'orange'}>
              {statusId === 1 ? 'Активен' : 'Отпуск'}
            </Badge>
            <Badge variant="outline" colorPalette="blue">
              {shiftSalary?.toLocaleString()} ₽
            </Badge>
          </Flex>
        </Box>
        <HStack gap={2}>
          <IconButton variant="ghost" colorPalette="blue" onClick={() => onDetails(security.id)}>
            <LuInfo size={18} />
          </IconButton>

          <IconButton variant="ghost" colorPalette="orange" onClick={() => onEdit(security)}>
            <LuPencil size={18} />
          </IconButton>

          <IconButton
            variant="ghost"
            colorPalette="red"
            onClick={() => onDelete(security.id)}
            loading={isDeleting}
          >
            <LuTrash2 size={18} />
          </IconButton>
        </HStack>
      </Flex>
    </Card.Root>
  )
})
