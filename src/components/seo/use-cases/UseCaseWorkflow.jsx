import { Box, Circle, Container, Heading, HStack, Stack, Text } from '@chakra-ui/react'

export default function UseCaseWorkflow({ title, steps }) {
  return (
    <Box
      as="section"
      py={{
        base: 16,
        md: 24,
      }}
    >
      <Container maxW="5xl">
        <Stack
          align="center"
          textAlign="center"
          gap="4"
          mb={{
            base: 10,
            md: 14,
          }}
        >
          <Heading
            maxW="700px"
            fontSize={{
              base: '3xl',
              md: '4xl',
            }}
            lineHeight="1.2"
          >
            {title}
          </Heading>

          <Text
            maxW="700px"
            color="gray.600"
            lineHeight="1.8"
            fontSize={{
              base: 'md',
              md: 'lg',
            }}
          >
            Несколько простых шагов — и процесс планирования становится прозрачным для руководителей
            и удобным для сотрудников.
          </Text>
        </Stack>

        <Stack gap="0">
          {steps.map((step, index) => (
            <HStack key={step.title} align="stretch" gap="6">
              <Stack align="center" minW="48px">
                <Circle size="12" bg="blue.600" color="white" fontWeight="700">
                  {index + 1}
                </Circle>

                {index !== steps.length - 1 && <Box flex="1" w="2px" bg="gray.200" minH="60px" />}
              </Stack>

              <Box
                flex="1"
                pb={{
                  base: 10,
                  md: 12,
                }}
              >
                <Heading size="md" mb="3">
                  {step.title}
                </Heading>

                <Text color="gray.600" lineHeight="1.8">
                  {step.description}
                </Text>
              </Box>
            </HStack>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
