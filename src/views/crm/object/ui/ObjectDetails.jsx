'use client'

import { Stack, Box, Text, Separator, Flex } from '@chakra-ui/react'

export const ObjectDetails = ({ object }) => {
  if (!object) return null

  const { title, description, createdAt } = object

  return (
    <Stack gap={6}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold">
          {title}
        </Text>
      </Box>

      <Separator />

      <Box>
        <Text fontWeight="bold" mb={1} fontSize="sm">
          Описание
        </Text>
        <Text fontSize="sm" color="black.600">
          {description || 'Нет'}
        </Text>
      </Box>

      <Text fontSize="xs" color="gray.400">
        В базе с: {new Date(createdAt).toLocaleDateString()}
      </Text>
    </Stack>
  )
}
