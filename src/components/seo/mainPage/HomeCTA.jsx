import NextLink from 'next/link'

import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'

export function HomeCTA({ title, description, button }) {
  return (
    <Box as="section" bg="blue.600" color="white">
      <Container
        maxW="4xl"
        py={{
          base: 20,
          md: 28,
        }}
      >
        <Stack align="center" textAlign="center" gap={6}>
          <Heading
            as="h2"
            maxW="720px"
            lineHeight="1.2"
            fontWeight="700"
            fontSize={{
              base: '3xl',
              md: '5xl',
            }}
          >
            {title}
          </Heading>

          <Text
            maxW="620px"
            color="whiteAlpha.900"
            lineHeight="1.8"
            fontSize={{
              base: 'md',
              md: 'lg',
            }}
          >
            {description}
          </Text>

          {button && (
            <Button
              size="lg"
              bg="white"
              color="blue.600"
              rounded="lg"
              _hover={{
                bg: 'gray.100',
              }}
              asChild
            >
              <NextLink href={button.href}>{button.label}</NextLink>
            </Button>
          )}

          <Text fontSize="sm" color="whiteAlpha.800">
            Без банковской карты • Регистрация за пару минут • Поддержка на каждом этапе
          </Text>
        </Stack>
      </Container>
    </Box>
  )
}
