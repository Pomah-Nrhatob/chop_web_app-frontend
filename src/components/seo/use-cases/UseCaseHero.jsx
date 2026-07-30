import NextLink from 'next/link'

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react'
import { LuArrowRight, LuClock3, LuCircleCheck, LuUsers, LuTrendingUp } from 'react-icons/lu'

export default function UseCaseHero({
  eyebrow = 'Use Case',
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
  highlights = [
    'Экономия времени',
    'Меньше ошибок',
    'Автоматизация процессов',
    'Контроль сотрудников',
  ],
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
        maxW="6xl"
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
            maxW="820px"
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
            maxW="700px"
            color="gray.600"
            fontSize={{
              base: 'md',
              md: 'lg',
            }}
            lineHeight="1.8"
          >
            {subtitle}
          </Text>

          <Flex wrap="wrap" justify="center" gap="3" pt="2">
            {highlights.map((item) => (
              <HStack key={item} px="4" py="2" rounded="full" bg="blue.50" color="blue.700" gap="2">
                <Icon boxSize={4}>
                  <LuCircleCheck />
                </Icon>
                <Text fontSize="sm" fontWeight="500">
                  {item}
                </Text>
              </HStack>
            ))}
          </Flex>

          <Flex
            direction={{
              base: 'column',
              sm: 'row',
            }}
            gap="3"
            pt="2"
            w={{
              base: 'full',
              sm: 'auto',
            }}
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

          <Flex
            mt="6"
            wrap="wrap"
            justify="center"
            gap={{
              base: 6,
              md: 10,
            }}
          >
            <HStack gap="2">
              <Icon color="blue.500">
                <LuClock3 />
              </Icon>
              <Text fontSize="sm" color="gray.600">
                Экономия времени
              </Text>
            </HStack>

            <HStack gap="2">
              <Icon color="blue.500">
                <LuUsers />
              </Icon>
              <Text fontSize="sm" color="gray.600">
                Удобно для всей команды
              </Text>
            </HStack>

            <HStack gap="2">
              <Icon color="blue.500">
                <LuTrendingUp />
              </Icon>
              <Text fontSize="sm" color="gray.600">
                Повышение эффективности
              </Text>
            </HStack>

            <HStack gap="2">
              <Icon color="blue.500">
                <LuArrowRight />
              </Icon>
              <Text fontSize="sm" color="gray.600">
                Быстрое внедрение
              </Text>
            </HStack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}
