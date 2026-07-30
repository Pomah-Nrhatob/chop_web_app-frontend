import { Box, Card, Container, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'

export default function SolutionChallenges({ title, subtitle, items = [] }) {
  if (!items.length) {
    return null
  }

  return (
    <Box as="section" bg="gray.50" borderBottomWidth="1px" borderColor="gray.200">
      <Container
        maxW="7xl"
        py={{
          base: 16,
          md: 24,
        }}
      >
        <Stack gap="12">
          <Stack align="center" textAlign="center" gap="4" maxW="3xl" mx="auto">
            <Heading
              as="h2"
              fontSize={{
                base: '3xl',
                md: '4xl',
              }}
            >
              {title}
            </Heading>

            {subtitle && (
              <Text
                color="gray.600"
                maxW="720px"
                fontSize={{
                  base: 'md',
                  md: 'lg',
                }}
              >
                {subtitle}
              </Text>
            )}
          </Stack>

          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
            }}
            gap="6"
          >
            {items.map((item) => (
              <Card.Root key={item.title} variant="outline" h="100%">
                <Card.Body>
                  <Stack gap="4">
                    <Heading as="h3" size="md" lineHeight="1.4">
                      {item.title}
                    </Heading>

                    <Text color="gray.600" lineHeight="1.8">
                      {item.description}
                    </Text>
                  </Stack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  )
}
