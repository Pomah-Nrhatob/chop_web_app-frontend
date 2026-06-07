// src/views/landing/HeroSection.jsx
'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  Flex,
  Badge,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { LuCalendar, LuShield, LuBuilding2, LuArrowRight, LuSparkles } from 'react-icons/lu'

export default function HeroSection() {
  const router = useRouter()

  return (
    <Box
      bg="linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)"
      color="white"
      position="relative"
      overflow="hidden"
      pt={{ base: 16, md: 24 }}
      pb={{ base: 20, md: 32 }}
    >
      {/* Декоративные круги на фоне */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="whiteAlpha.100"
        blur="3xl"
      />
      <Box
        position="absolute"
        bottom="-150px"
        left="-150px"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="whiteAlpha.50"
        blur="3xl"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={{ base: 10, lg: 16 }}>
          {/* Левая часть — текст */}
          <Box flex={1} textAlign={{ base: 'center', lg: 'left' }}>
            <Badge
              colorPalette="cyan"
              variant="subtle"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="medium"
              mb={4}
              bg="whiteAlpha.200"
              color="white"
            >
              <LuSparkles style={{ display: 'inline', marginRight: '6px' }} />
              CRM-система нового поколения
            </Badge>

            <Heading
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
              lineHeight="1.1"
              mb={6}
            >
              Управление охраной{' '}
              <Box as="span" color="cyan.200">
                просто и удобно
              </Box>
            </Heading>

            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="whiteAlpha.900"
              mb={8}
              maxW="600px"
              mx={{ base: 'auto', lg: 0 }}
              lineHeight="1.6"
            >
              Единая система для управления объектами, сотрудниками и их расписанием. Календари,
              аналитика и полный контроль в одном месте.
            </Text>

            <HStack gap={4} justify={{ base: 'center', lg: 'flex-start' }} flexWrap="wrap">
              <Button
                size="lg"
                bg="white"
                color="blue.700"
                _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => router.push('/login')}
                rightIcon={<LuArrowRight />}
                fontWeight="bold"
                px={8}
              >
                Начать бесплатно
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="whiteAlpha.400"
                _hover={{ bg: 'whiteAlpha.100' }}
                onClick={() => router.push('/login')}
                fontWeight="medium"
              >
                Войти в систему
              </Button>
            </HStack>

            <HStack
              gap={6}
              mt={8}
              justify={{ base: 'center', lg: 'flex-start' }}
              flexWrap="wrap"
              color="whiteAlpha.800"
              fontSize="sm"
            >
              <HStack gap={2}>
                <Box w={2} h={2} borderRadius="full" bg="green.400" />
                <Text>Без кредитной карты</Text>
              </HStack>
              <HStack gap={2}>
                <Box w={2} h={2} borderRadius="full" bg="green.400" />
                <Text>Настройка за 5 минут</Text>
              </HStack>
              <HStack gap={2}>
                <Box w={2} h={2} borderRadius="full" bg="green.400" />
                <Text>Поддержка 24/7</Text>
              </HStack>
            </HStack>
          </Box>

          {/* Правая часть — превью интерфейса */}
          <Box flex={1} maxW="600px" w="100%">
            <Box
              bg="white"
              borderRadius="2xl"
              shadow="2xl"
              p={6}
              transform={{ base: 'none', lg: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)' }}
              transition="transform 0.3s"
              _hover={{ transform: 'perspective(1000px) rotateY(0) rotateX(0)' }}
            >
              {/* Имитация интерфейса */}
              <Box borderBottom="1px solid" borderColor="gray.200" pb={3} mb={4}>
                <HStack justify="space-between">
                  <HStack gap={2}>
                    <Box w={3} h={3} borderRadius="full" bg="red.400" />
                    <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
                    <Box w={3} h={3} borderRadius="full" bg="green.400" />
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    crm.athleticapp.ru
                  </Text>
                </HStack>
              </Box>

              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color="gray.800" fontSize="sm">
                    График объектов
                  </Text>
                  <Badge colorPalette="green" variant="subtle" fontSize="2xs">
                    Активно
                  </Badge>
                </HStack>

                {/* Мини-сетка календаря */}
                <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1}>
                  {Array.from({ length: 15 }).map((_, i) => {
                    const colors = ['green.100', 'yellow.100', 'orange.100', 'blue.100', 'gray.100']
                    return (
                      <Box
                        key={i}
                        h="40px"
                        bg={colors[i % colors.length]}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={colors[i % colors.length].replace('.100', '.300')}
                      />
                    )
                  })}
                </Box>

                <HStack gap={2} pt={2}>
                  <LuCalendar color="#3b82f6" size={16} />
                  <Text fontSize="xs" color="gray.600">
                    Октябрь 2026 · 12 объектов
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}
