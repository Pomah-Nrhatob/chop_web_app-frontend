import NextLink from 'next/link'

import { Badge, Box, Button, Container, Flex, Heading, Stack, Text } from '@chakra-ui/react'

export default function SolutionHero({
  eyebrow = 'Решения',
  h1,
  subtitle,
  primaryAction = {
    label: 'Начать пользоваться бесплатно',
    href: '/registration',
  },
  secondaryAction = {
    label: 'Все возможности',
    href: '/features',
  },
}) {
  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
    >
      <Box
        position="absolute"
        top="-180px"
        left="50%"
        transform="translateX(-50%)"
        w={{ base: '320px', md: '560px' }}
        h={{ base: '320px', md: '560px' }}
        rounded="full"
        bg="blue.50"
        filter="blur(120px)"
        opacity="0.8"
        pointerEvents="none"
      />

      <Container
        maxW="5xl"
        position="relative"
        zIndex="1"
        py={{
          base: 16,
          md: 24,
        }}
      >
        <Stack
          align="center"
          textAlign="center"
          gap={{
            base: 5,
            md: 7,
          }}
        >
          <Badge colorPalette="blue" variant="subtle" px="3" py="1" rounded="full" fontSize="sm">
            {eyebrow}
          </Badge>

          <Heading
            as="h1"
            maxW="760px"
            fontWeight="700"
            color="gray.900"
            lineHeight="1.1"
            letterSpacing="-0.03em"
            fontSize={{
              base: '3xl',
              sm: '4xl',
              lg: '5xl',
            }}
          >
            {h1}
          </Heading>

          <Text
            maxW="640px"
            color="gray.600"
            fontSize={{
              base: 'md',
              md: 'lg',
            }}
            lineHeight="1.8"
          >
            {subtitle}
          </Text>

          <Flex
            direction={{
              base: 'column',
              sm: 'row',
            }}
            gap="3"
            w={{
              base: 'full',
              sm: 'auto',
            }}
            pt="2"
          >
            <Button
              asChild
              size="lg"
              rounded="lg"
              w={{
                base: 'full',
                sm: 'auto',
              }}
            >
              <NextLink href={primaryAction.href}>{primaryAction.label}</NextLink>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              rounded="lg"
              w={{
                base: 'full',
                sm: 'auto',
              }}
            >
              <NextLink href={secondaryAction.href}>{secondaryAction.label}</NextLink>
            </Button>
          </Flex>

          <Flex mt="2" wrap="wrap" justify="center" gap="4" color="gray.500" fontSize="sm">
            <Text>Неограниченное количество объектов</Text>
            <Text>Управление сотрудниками</Text>
            <Text>Работает в браузере</Text>
            <Text>Бесплатный старт</Text>
          </Flex>

          {/*
          <Box
            mt={{
              base: 8,
              md: 12,
            }}
            w="full"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="2xl"
            overflow="hidden"
            shadow="lg"
          >
            <Image
              src="/images/solutions/construction.webp"
              alt={h1}
              w="full"
            />
          </Box>
          */}
        </Stack>
      </Container>
    </Box>
  )
}
