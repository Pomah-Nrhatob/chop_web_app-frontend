'use client'

import { InfoSection } from '@/components/ui/InfoCard'
import { Stack, Box, Text, Separator } from '@chakra-ui/react'

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

      <InfoSection label="Описание" value={description} color="black.600" />

      <Text fontSize="xs" color="gray.400">
        В базе с: {new Date(createdAt).toLocaleDateString()}
      </Text>
    </Stack>
  )
}
