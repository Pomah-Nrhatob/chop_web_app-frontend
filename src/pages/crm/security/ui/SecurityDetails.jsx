'use client'

import { Stack, Box, Text, Badge, SimpleGrid, Separator, Flex } from '@chakra-ui/react'
import { LuUser, LuShieldCheck, LuHeartPulse, LuBriefcase } from 'react-icons/lu'

export const SecurityDetails = ({ security }) => {
  if (!security) return null

  const {
    surname,
    name,
    patronymic,
    age,
    hasLicense,
    personality,
    healthStatus,
    chronicDiseases,
    shiftSalary,
    statusId,
    createdAt,
  } = security

  const InfoRow = ({ icon: Icon, label, value }) => (
    <Flex align="center" gap={3} py={2}>
      <Icon size={18} style={{ color: 'var(--chakra-colors-blue-500)' }} />
      <Box>
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          {label}
        </Text>
        <Text fontSize="md" fontWeight="semibold">
          {value || '—'}
        </Text>
      </Box>
    </Flex>
  )

  return (
    <Stack gap={6}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold">
          {surname} {name} {patronymic}
        </Text>
        <Badge colorPalette={statusId === 1 ? 'green' : 'orange'}>
          {statusId === 1 ? 'Активен' : 'Вне смены'}
        </Badge>
      </Box>

      <Separator />

      <SimpleGrid columns={2} gap={4}>
        <InfoRow icon={LuUser} label="Возраст" value={`${age} лет`} />
        <InfoRow icon={LuBriefcase} label="Ставка" value={`${shiftSalary?.toLocaleString()} ₽`} />
        <InfoRow
          icon={LuShieldCheck}
          label="Лицензия"
          value={hasLicense ? 'Есть' : 'Отсутствует'}
        />
        <InfoRow icon={LuHeartPulse} label="Здоровье" value={healthStatus} />
      </SimpleGrid>

      <Box bg="gray.50" p={4} borderRadius="md">
        <Text fontWeight="bold" mb={1} fontSize="sm">
          Личные качества:
        </Text>
        <Text fontSize="sm" color="gray.700 italic">
          {personality || 'Нет описания'}
        </Text>
      </Box>

      <Box>
        <Text fontWeight="bold" mb={1} fontSize="sm">
          Хронические заболевания:
        </Text>
        <Text fontSize="sm" color="red.600">
          {chronicDiseases || 'Не зафиксированы'}
        </Text>
      </Box>

      <Text fontSize="xs" color="gray.400">
        В базе с: {new Date(createdAt).toLocaleDateString()}
      </Text>
    </Stack>
  )
}
