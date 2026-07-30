import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function SolutionOverview({ title, description }) {
  if (!title && !description) {
    return null
  }

  const paragraphs = Array.isArray(description) ? description : [description]

  return (
    <Box as="section" bg="gray.50" borderBottomWidth="1px" borderColor="gray.200">
      <Container
        maxW="4xl"
        py={{
          base: 16,
          md: 24,
        }}
      >
        <Stack gap="10">
          {title && (
            <Stack align="center" textAlign="center" gap="4">
              <Heading
                as="h2"
                fontSize={{
                  base: '3xl',
                  md: '4xl',
                }}
              >
                {title}
              </Heading>
            </Stack>
          )}

          <Stack
            gap="6"
            color="gray.600"
            fontSize={{
              base: 'md',
              md: 'lg',
            }}
            lineHeight="1.8"
          >
            {paragraphs.map((paragraph) => (
              <Text key={paragraph}>{paragraph}</Text>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
