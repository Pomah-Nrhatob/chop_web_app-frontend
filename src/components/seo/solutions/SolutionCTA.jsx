import NextLink from 'next/link'

import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function SolutionCTA({ title, description, primaryAction, secondaryAction }) {
  if (!title) {
    return null
  }

  return (
    <Box as="section" bg="white">
      <Container
        maxW="4xl"
        py={{
          base: 20,
          md: 28,
        }}
      >
        <Stack align="center" textAlign="center" gap="6">
          <Heading
            as="h2"
            maxW="720px"
            color="gray.900"
            lineHeight="1.2"
            fontWeight="700"
            fontSize={{
              base: '3xl',
              md: '4xl',
            }}
          >
            {title}
          </Heading>

          {description && (
            <Text
              maxW="620px"
              color="gray.600"
              fontSize={{
                base: 'md',
                md: 'lg',
              }}
              lineHeight="1.8"
            >
              {description}
            </Text>
          )}

          {(primaryAction || secondaryAction) && (
            <Stack
              direction={{
                base: 'column',
                sm: 'row',
              }}
              gap="3"
              mt="2"
              w={{
                base: 'full',
                sm: 'auto',
              }}
            >
              {primaryAction && (
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
              )}

              {secondaryAction && (
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
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  )
}
