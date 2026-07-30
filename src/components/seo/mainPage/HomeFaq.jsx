'use client'

import { Accordion, Badge, Box, Container, Heading, Stack, Text } from '@chakra-ui/react'

export function HomeFaq({ title, description, items = [] }) {
  if (!items.length) {
    return null
  }

  return (
    <Box as="section" bg="white" py={{ base: 16, md: 24 }}>
      <Container maxW="4xl">
        <Stack gap={12}>
          <Stack gap={4} align="center" textAlign="center">
            <Badge colorPalette="blue" px={4} py={2} rounded="full">
              FAQ
            </Badge>

            <Heading
              as="h2"
              fontSize={{
                base: '3xl',
                md: '5xl',
              }}
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
              {description}
            </Text>
          </Stack>

          <Accordion.Root collapsible defaultValue={[items[0].question]}>
            {items.map((item) => (
              <Accordion.Item key={item.question} value={item.question}>
                <Accordion.ItemTrigger py={5}>
                  <Heading size="md" flex="1" textAlign="left">
                    {item.question}
                  </Heading>

                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>

                <Accordion.ItemContent>
                  <Accordion.ItemBody pb={5} color="gray.600" lineHeight="1.8">
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
