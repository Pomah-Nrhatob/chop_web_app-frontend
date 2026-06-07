'use client'

import { Box, Container, Text, Flex, HStack, VStack, Link } from '@chakra-ui/react'
import { LuShield } from 'react-icons/lu'

export default function LandingFooter() {
  return (
    <Box bg="gray.900" color="white" py={12}>
      <Container maxW="container.xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          gap={8}
          mb={8}
        >
          {/* Логотип */}
          <HStack gap={3}>
            <Box
              w="40px"
              h="40px"
              borderRadius="lg"
              bg="linear-gradient(135deg, #3b82f6, #06b6d4)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LuShield color="white" size={24} />
            </Box>
            <VStack align="flex-start" gap={0}>
              <Text fontWeight="bold" fontSize="lg">
                SecurityCRM
              </Text>
              <Text fontSize="xs" color="gray.400">
                Управление охраной
              </Text>
            </VStack>
          </HStack>

          {/* Ссылки */}
          <HStack gap={8} flexWrap="wrap">
            <VStack align="flex-start" gap={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.400">
                Продукт
              </Text>
              <Link href="#" color="gray.300" fontSize="sm" _hover={{ color: 'white' }}>
                Возможности
              </Link>
              <Link href="#" color="gray.300" fontSize="sm" _hover={{ color: 'white' }}>
                Как это работает
              </Link>
            </VStack>
            <VStack align="flex-start" gap={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.400">
                Компания
              </Text>
              <Link href="#" color="gray.300" fontSize="sm" _hover={{ color: 'white' }}>
                О нас
              </Link>
              <Link href="#" color="gray.300" fontSize="sm" _hover={{ color: 'white' }}>
                Контакты
              </Link>
            </VStack>
          </HStack>
        </Flex>

        {/* ✅ Гарантированно работающий разделитель */}
        <Box w="100%" h="1px" bg="gray.700" my={6} />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="sm" color="gray.400">
            © {new Date().getFullYear()} SecurityCRM. Все права защищены.
          </Text>
          <HStack gap={4}>
            <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
              Политика конфиденциальности
            </Link>
            <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
              Условия использования
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
