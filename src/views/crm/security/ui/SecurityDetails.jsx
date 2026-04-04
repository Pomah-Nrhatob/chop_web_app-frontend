'use client'

import { InfoRow, InfoSection } from '@/components/ui/InfoCard'
import { Stack, Box, Text, Badge, SimpleGrid, Separator } from '@chakra-ui/react'
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

      <InfoSection label="Личные качества:" value={personality} bg="gray.50" italic />

      <InfoSection label="Хронические заболевания:" value={chronicDiseases} color="red.600" />

      <Text fontSize="xs" color="gray.400">
        В базе с: {new Date(createdAt).toLocaleDateString()}
      </Text>
    </Stack>
  )
}
