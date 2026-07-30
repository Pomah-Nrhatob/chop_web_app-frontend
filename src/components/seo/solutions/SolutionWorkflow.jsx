import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function SolutionWorkflow({ title, subtitle, steps = [] }) {
  if (!steps.length) {
    return null
  }

  return (
    <Box as="section" bg="gray.50" borderBottomWidth="1px" borderColor="gray.200">
      <Container
        maxW="5xl"
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
                maxW="720px"
                color="gray.600"
                fontSize={{
                  base: 'md',
                  md: 'lg',
                }}
              >
                {subtitle}
              </Text>
            )}
          </Stack>

          <Stack gap="0">
            {steps.map((step, index) => (
              <Stack key={step.title} direction="row" align="flex-start" gap="6">
                <Stack align="center" gap="0" minW="48px">
                  <Box
                    w="12"
                    h="12"
                    rounded="full"
                    bg="blue.500"
                    color="white"
                    fontWeight="700"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {index + 1}
                  </Box>

                  {index < steps.length - 1 && <Box w="2px" flex="1" minH="72px" bg="gray.200" />}
                </Stack>

                <Box pb="10" pt="1">
                  <Heading as="h3" size="md" mb="3">
                    {step.title}
                  </Heading>

                  <Text color="gray.600" lineHeight="1.8">
                    {step.description}
                  </Text>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
