'use client'

import { Badge, Box, Separator, SimpleGrid, Stack, Text } from '@chakra-ui/react'

import {
  LuBadgeCheck,
  LuBriefcase,
  LuCalendar,
  LuHeartPulse,
  LuPhone,
  LuShieldCheck,
  LuUser,
} from 'react-icons/lu'

import { InfoRow, InfoSection } from '@/components/ui/InfoCard'
import { useGetDictionarySecurityPosition } from '@/features/dictionary/api/use-get-dictionary-securityPosition'

const formatDate = (value) => {
  if (!value) return '—'

  return new Date(value).toLocaleDateString('ru-RU')
}

export const SecurityDetails = ({ security }) => {
  const getAge = (birthDate) => {
    if (!birthDate) return '—'

    const birth = new Date(birthDate)
    const today = new Date()

    let age = today.getFullYear() - birth.getFullYear()

    const hasBirthdayPassed =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())

    if (!hasBirthdayPassed) {
      age--
    }

    return `${age} лет`
  }

  const { data: positions = [], isLoading } = useGetDictionarySecurityPosition()

  if (!security) return null

  return (
    <Stack gap={6}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold">
          {security.surname} {security.name} {security.patronymic}
        </Text>

        <Badge mt={2} colorPalette={security.statusId === 1 ? 'green' : 'orange'}>
          {security.statusId === 1 ? 'Активен' : 'Уволен'}
        </Badge>
      </Box>

      <Separator />

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <InfoRow icon={LuPhone} label="Телефон" value={security.phoneNumber} />

        <InfoRow
          icon={LuBriefcase}
          label="Должность"
          value={
            security.positionId ? positions.find((el) => el.id === security.positionId).name : '—'
          }
        />

        <InfoRow
          icon={LuBadgeCheck}
          label="Статус"
          value={security.status?.title ?? (security.statusId === 1 ? 'Активен' : 'Уволен')}
        />

        <InfoRow
          icon={LuShieldCheck}
          label="Лицензия"
          value={security.hasLicense ? 'Есть' : 'Нет'}
        />

        <InfoRow icon={LuUser} label="Возраст" value={getAge(security.birthDate)} />

        <InfoRow icon={LuHeartPulse} label="Здоровье" value={security.healthStatus} />

        <InfoRow
          icon={LuBriefcase}
          label="Ставка"
          value={security.shiftSalary ? `${security.shiftSalary.toLocaleString()} ₽` : '—'}
        />

        <InfoRow icon={LuCalendar} label="Дата рождения" value={formatDate(security.birthDate)} />

        <InfoRow icon={LuCalendar} label="Дата приема" value={formatDate(security.hireDate)} />

        <InfoRow
          icon={LuCalendar}
          label="Дата увольнения"
          value={formatDate(security.dismissalDate)}
        />
      </SimpleGrid>

      <InfoSection label="Личные качества" value={security.personality} bg="gray.50" />

      <InfoSection label="Хронические заболевания" value={security.chronicDiseases} bg="gray.50" />

      <Text fontSize="xs" color="gray.500">
        Создан: {formatDate(security.createdAt)}
      </Text>
    </Stack>
  )
}
