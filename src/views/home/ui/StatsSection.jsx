// src/views/landing/StatsSection.jsx
'use client'

import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack } from '@chakra-ui/react'

const stats = [
  { value: '500+', label: 'Активных компаний' },
  { value: '10 000+', label: 'Сотрудников в системе' },
  { value: '50 000+', label: 'Смен в месяц' },
  { value: '99.9%', label: 'Время работы' },
]

export default function StatsSection() {
  return (
    <Box
      py={{ base: 16, md: 20 }}
      bg="linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
      color="white"
    >
      <Container maxW="container.xl">
        <VStack gap={4} mb={12} textAlign="center">
          <Heading size={{ base: 'xl', md: '2xl' }}>Нам доверяют</Heading>
          <Text color="whiteAlpha.800" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
            Тысячи компаний уже используют нашу систему для управления охраной
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={8}>
          {stats.map((stat, idx) => (
            <VStack key={idx} gap={2} textAlign="center">
              <Heading
                size={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                bgGradient="linear(to-r, white, cyan.200)"
                bgClip="text"
              >
                {stat.value}
              </Heading>
              <Text color="whiteAlpha.800" fontSize="sm" fontWeight="medium">
                {stat.label}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
