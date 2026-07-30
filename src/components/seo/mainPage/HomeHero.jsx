import NextImage from 'next/image'
import NextLink from 'next/link'

import { Badge, Box, Button, Container, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'

export function HomeHero() {
  return (
    <Box
      position="relative"
      overflow="hidden"
      bgGradient="linear(to-b, blue.50, white)"
      py={{ base: 20, md: 32 }}
    >
      <Box
        position="absolute"
        top="-180px"
        left="-120px"
        w="420px"
        h="420px"
        rounded="full"
        bg="blue.100"
        filter="blur(120px)"
        opacity="0.55"
      />

      <Box
        position="absolute"
        right="-150px"
        bottom="-200px"
        w="420px"
        h="420px"
        rounded="full"
        bg="cyan.100"
        filter="blur(120px)"
        opacity="0.45"
      />

      <Container maxW="7xl" position="relative">
        <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={{ base: 20, lg: 24 }}>
          <Stack
            flex="1"
            gap={8}
            align={{ base: 'center', lg: 'flex-start' }}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            <Badge
              colorPalette="blue"
              px={4}
              py={2}
              rounded="full"
              fontSize="sm"
              fontWeight="medium"
            >
              Управление персоналом в одной системе
            </Badge>

            <Heading
              as="h1"
              maxW="720px"
              lineHeight="1"
              letterSpacing="-0.03em"
              fontWeight="bold"
              fontSize={{
                base: '4xl',
                md: '6xl',
                xl: '7xl',
              }}
            >
              Автоматизируйте управление персоналом без Excel
            </Heading>

            <Text
              maxW="620px"
              color="gray.600"
              lineHeight="1.9"
              fontSize={{ base: 'lg', md: 'xl' }}
            >
              Планируйте графики работы, учитывайте рабочее время, контролируйте сотрудников и
              автоматически рассчитывайте заработную плату в одной современной системе.
            </Text>

            <Stack direction={{ base: 'column', sm: 'row' }} gap={4}>
              <Button size="lg" colorPalette="blue" px={8} asChild>
                <NextLink href="/registration">Начать бесплатно</NextLink>
              </Button>

              <Button size="lg" variant="outline" px={8} asChild>
                <NextLink href="/features">Смотреть возможности</NextLink>
              </Button>
            </Stack>

            <HStack wrap="wrap" gap={5} color="gray.600" fontSize="sm">
              <HStack gap={2}>
                <FaCheckCircle color="#3182ce" />
                <Text>Бесплатно</Text>
              </HStack>

              <HStack gap={2}>
                <FaCheckCircle color="#3182ce" />
                <Text>Без банковской карты</Text>
              </HStack>

              <HStack gap={2}>
                <FaCheckCircle color="#3182ce" />
                <Text>Облачный сервис</Text>
              </HStack>
            </HStack>
          </Stack>

          <Box flex="1" w="100%" maxW="640px">
            <Box
              overflow="hidden"
              bg="white"
              rounded="3xl"
              border="1px solid"
              borderColor="gray.200"
              shadow="2xl"
              transform={{
                lg: 'perspective(1200px) rotateY(-8deg) rotateX(3deg)',
              }}
              transition="all .3s"
              _hover={{
                transform: {
                  lg: 'perspective(1200px) rotateY(-4deg) rotateX(1deg)',
                },
              }}
            >
              <NextImage
                src="/images/mainPage/mainImage.png"
                alt="Пример интерфейса Uchop"
                width={1400}
                height={900}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
                priority
              />
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}
