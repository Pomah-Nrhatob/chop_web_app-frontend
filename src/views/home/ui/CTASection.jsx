'use client'

import { Box, Container, Heading, Text, Button, VStack, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { LuArrowRight, LuCheck } from 'react-icons/lu'

const benefits = [
  'Бесплатный пробный период',
  'Без ограничений по объектам',
  'Поддержка на русском языке',
]

export default function CTASection() {
  const router = useRouter()

  return (
    <Box py={{ base: 16, md: 24 }} bg="white">
      <Container maxW="container.md">
        <Box
          bg="linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
          borderRadius="2xl"
          p={{ base: 8, md: 12 }}
          color="white"
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          {/* Декоративные элементы */}
          <Box
            position="absolute"
            top="-50px"
            right="-50px"
            w="200px"
            h="200px"
            borderRadius="full"
            bg="whiteAlpha.100"
          />
          <Box
            position="absolute"
            bottom="-80px"
            left="-80px"
            w="250px"
            h="250px"
            borderRadius="full"
            bg="whiteAlpha.50"
          />

          <VStack gap={6} position="relative" zIndex={1}>
            <Heading size={{ base: 'xl', md: '2xl' }} fontWeight="bold">
              Готовы начать?
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.900" maxW="500px">
              Присоединяйтесь к компаниям, которые уже упростили управление охраной
            </Text>

            <VStack gap={3} align="flex-start">
              {benefits.map((benefit, idx) => (
                <HStack key={idx} gap={2}>
                  {/* ✅ Гарантированно работающая иконка */}
                  <LuCheck color="#86efac" size={24} />
                  <Text fontSize="sm" color="whiteAlpha.900">
                    {benefit}
                  </Text>
                </HStack>
              ))}
            </VStack>

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
              mt={2}
            >
              Создать аккаунт
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
