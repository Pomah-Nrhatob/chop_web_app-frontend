import NextLink from 'next/link'

import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function FeatureCTA({ title, description, button }) {
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

          <Button asChild size="lg" rounded="lg" mt="2">
            <NextLink href={button.href}>{button.label}</NextLink>
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
