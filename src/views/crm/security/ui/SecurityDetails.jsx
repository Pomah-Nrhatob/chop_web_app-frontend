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

import { FaRegBuilding } from 'react-icons/fa'

import { InfoRow, InfoSection } from '@/components/ui/InfoCard'
import { useGetDictionarySecurityPosition } from '@/features/dictionary/api/use-get-dictionary-securityPosition'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'

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

  const { data: positions = [] } = useGetDictionarySecurityPosition()
  const { data: objects = [] } = useGetDictionaryObjects()

  const formatPhoneNumber = (phone) => {
    if (!phone) return '—'

    const digits = phone.replace(/\D/g, '')

    // +7XXXXXXXXXX или 7XXXXXXXXXX
    if (digits.length === 11 && digits.startsWith('7')) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
    }

    // 8XXXXXXXXXX -> +7
    if (digits.length === 11 && digits.startsWith('8')) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
    }

    return phone
  }

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
        <InfoRow icon={LuPhone} label="Телефон" value={formatPhoneNumber(security.phoneNumber)} />

        <InfoRow
          icon={LuBriefcase}
          label="Должность"
          value={
            security.positionId ? positions.find((el) => el.id === security.positionId)?.name : '—'
          }
        />

        <InfoRow
          icon={FaRegBuilding}
          label="Объект"
          value={
            security.objectId
              ? (objects?.find((el) => el.id === security.objectId)?.title ?? '—')
              : '—'
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
