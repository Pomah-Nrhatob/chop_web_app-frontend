'use client'

import { Accordion, Box, Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function FeatureFaq({
  title = 'Часто задаваемые вопросы',
  description = 'Ответы на самые популярные вопросы о работе функции.',
  items = [],
}) {
  if (!items.length) {
    return null
  }

  return (
    <Box as="section" bg="gray.50" borderBottomWidth="1px" borderColor="gray.200">
      <Container
        maxW="4xl"
        py={{
          base: 16,
          md: 24,
        }}
      >
        <Stack gap="12">
          <Stack align="center" textAlign="center" gap="4">
            <Heading
              fontSize={{
                base: '3xl',
                md: '4xl',
              }}
            >
              {title}
            </Heading>

            <Text
              maxW="640px"
              color="gray.600"
              fontSize={{
                base: 'md',
                md: 'lg',
              }}
            >
              {description}
            </Text>
          </Stack>

          <Accordion.Root collapsible defaultValue={[items[0].question]}>
            {items.map((item) => (
              <Accordion.Item key={item.question} value={item.question}>
                <Accordion.ItemTrigger py="5">
                  <Box flex="1" textAlign="left" fontWeight="600">
                    {item.question}
                  </Box>

                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>

                <Accordion.ItemContent>
                  <Accordion.ItemBody color="gray.600" lineHeight="1.8" pb="5">
                    {item.answer}
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
      </Container>
    </Box>
  )
}
