import { Box, Container, Heading, HStack, Text } from '@chakra-ui/react'

export default function ContainerForPage({ children, actionComponent = null, title, text }) {
  return (
    <Container maxW="container.lg" py={10}>
      <Box>
        {/* Header */}
        <HStack justify="space-between" align="center" gap={6} pb={6}>
          <Box>
            <Heading size="lg">{title}</Heading>

            {text && (
              <Text mt={2} color="gray.500" fontSize="sm">
                {text}
              </Text>
            )}
          </Box>

          {actionComponent}
        </HStack>

        {/* Divider */}
        <Box borderBottomWidth="2px" />

        {/* Content */}
        <Box pt={4}>{children}</Box>
      </Box>
    </Container>
  )
}
