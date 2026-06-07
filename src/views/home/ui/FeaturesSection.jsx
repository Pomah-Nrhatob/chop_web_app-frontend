// src/views/landing/FeaturesSection.jsx
'use client'

import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon } from '@chakra-ui/react'
import {
  LuBuilding2,
  LuUsers,
  LuCalendar,
  LuCalendarDays,
  LuBuilding,
  LuShield,
  LuCheckCircle2,
  LuClock,
} from 'react-icons/lu'

const features = [
  {
    icon: LuBuilding2,
    title: 'Управление объектами',
    description:
      'Создавайте и редактируйте объекты охраны. Храните всю информацию в одном месте с удобным списком.',
    color: 'blue',
  },
  {
    icon: LuUsers,
    title: 'База сотрудников',
    description:
      'Полная база охранников с контактами, статусами и историей. Быстрый поиск и фильтрация.',
    color: 'purple',
  },
  {
    icon: LuCalendar,
    title: 'Календарь всех объектов',
    description:
      'Обзор расписания всех объектов на месяц. Быстрое переключение между датами и объектами.',
    color: 'green',
  },
  {
    icon: LuCalendarDays,
    title: 'Календарь дня',
    description: 'Детальный просмотр конкретного дня. Редактирование смен прямо в интерфейсе.',
    color: 'orange',
  },
  {
    icon: LuBuilding,
    title: 'Мультикомпания',
    description: 'Работайте с несколькими компаниями. Мгновенное переключение между организациями.',
    color: 'cyan',
  },
  {
    icon: LuShield,
    title: 'Контроль доступа',
    description: 'Гибкая система ролей и прав. Каждый видит только то, что ему разрешено.',
    color: 'red',
  },
]

export default function FeaturesSection() {
  return (
    <Box py={{ base: 16, md: 24 }} bg="white">
      <Container maxW="container.xl">
        <VStack gap={4} mb={{ base: 12, md: 16 }} textAlign="center">
          <Text
            color="blue.600"
            fontWeight="semibold"
            fontSize="sm"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Возможности
          </Text>
          <Heading size={{ base: 'xl', md: '2xl' }} color="gray.800" maxW="700px">
            Всё необходимое для управления охраной
          </Heading>
          <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
            Мощные инструменты, которые экономят ваше время и упрощают работу
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {features.map((feature, idx) => (
            <Box
              key={idx}
              p={6}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              transition="all 0.2s"
              _hover={{
                borderColor: `${feature.color}.300`,
                shadow: 'lg',
                transform: 'translateY(-4px)',
              }}
            >
              <HStack
                w="48px"
                h="48px"
                borderRadius="lg"
                bg={`${feature.color}.50`}
                color={`${feature.color}.600`}
                align="center"
                justify="center"
                mb={4}
              >
                <Icon as={feature.icon} boxSize={6} />
              </HStack>

              <Heading size="md" mb={2} color="gray.800">
                {feature.title}
              </Heading>
              <Text color="gray.600" fontSize="sm" lineHeight="1.6">
                {feature.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
