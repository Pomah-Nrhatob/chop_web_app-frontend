'use client'

import { memo } from 'react'
import { Card, Flex, Box, Text, IconButton, HStack } from '@chakra-ui/react'
import { LuTrash2, LuInfo, LuPencil } from 'react-icons/lu'

export const ObjectItem = memo(({ object, isDeleting, onDelete, onDetails, onEdit }) => {
  const { title } = object

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
            {title}
          </Text>
        </Box>
        <HStack gap={2}>
          <IconButton variant="ghost" colorPalette="blue" onClick={() => onDetails(object.id)}>
            <LuInfo size={18} />
          </IconButton>

          <IconButton variant="ghost" colorPalette="orange" onClick={() => onEdit(object)}>
            <LuPencil size={18} />
          </IconButton>

          <IconButton
            variant="ghost"
            colorPalette="red"
            onClick={() => onDelete(object.id)}
            loading={isDeleting}
          >
            <LuTrash2 size={18} />
          </IconButton>
        </HStack>
      </Flex>
    </Card.Root>
  )
})
