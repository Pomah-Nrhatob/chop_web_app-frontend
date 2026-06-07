// src/views/landing/HowItWorksSection.jsx
'use client'

import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon } from '@chakra-ui/react'
import { LuUserPlus, LuBuilding2, LuCalendarCheck, LuTrendingUp } from 'react-icons/lu'

const steps = [
  {
    number: '01',
    icon: LuUserPlus,
    title: 'Регистрация',
    description: 'Создайте аккаунт и свою первую компанию за пару минут.',
  },
  {
    number: '02',
    icon: LuBuilding2,
    title: 'Добавьте объекты',
    description: 'Зарегистрируйте все объекты охраны и загрузите базу сотрудников.',
  },
  {
    number: '03',
    icon: LuCalendarCheck,
    title: 'Составьте расписание',
    description: 'Используйте удобный календарь для назначения смен и контроля явок.',
  },
  {
    number: '04',
    icon: LuTrendingUp,
    title: 'Управляйте процессами',
    description: 'Отслеживайте статистику, управляйте доступом и масштабируйте бизнес.',
  },
]

export default function HowItWorksSection() {
  return (
    <Box py={{ base: 16, md: 24 }} bg="gray.50">
      <Container maxW="container.xl">
        <VStack gap={4} mb={{ base: 12, md: 16 }} textAlign="center">
          <Text
            color="blue.600"
            fontWeight="semibold"
            fontSize="sm"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Как это работает
          </Text>
          <Heading size={{ base: 'xl', md: '2xl' }} color="gray.800" maxW="700px">
            Начните работу за 4 простых шага
          </Heading>
          <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
            От регистрации до полного контроля — всё максимально просто
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          {steps.map((step, idx) => (
            <Box
              key={idx}
              position="relative"
              p={6}
              borderRadius="xl"
              bg="white"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              {/* Номер шага */}
              <Box
                position="absolute"
                top="-12px"
                left="24px"
                bg="linear-gradient(135deg, #3b82f6, #06b6d4)"
                color="white"
                fontWeight="bold"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
                shadow="md"
              >
                Шаг {step.number}
              </Box>

              <VStack align="flex-start" gap={3} mt={2}>
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="lg"
                  bg="blue.50"
                  color="blue.600"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={step.icon} boxSize={6} />
                </Box>

                <Heading size="md" color="gray.800">
                  {step.title}
                </Heading>
                <Text color="gray.600" fontSize="sm" lineHeight="1.6">
                  {step.description}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
