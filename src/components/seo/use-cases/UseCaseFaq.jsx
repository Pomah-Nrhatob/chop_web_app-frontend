'use client'

import { Accordion, Box, Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function UseCaseFaq({ items }) {
  return (
    <Box
      as="section"
      py={{
        base: 16,
        md: 24,
      }}
      bg="gray.50"
    >
      <Container maxW="4xl">
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
            fontSize={{
              base: '3xl',
              md: '4xl',
            }}
            lineHeight="1.2"
          >
            Часто задаваемые вопросы
          </Heading>

          <Text
            maxW="680px"
            color="gray.600"
            lineHeight="1.8"
            fontSize={{
              base: 'md',
              md: 'lg',
            }}
          >
            Ответы на самые популярные вопросы об автоматизации процессов с помощью Uchop.
          </Text>
        </Stack>

        <Accordion.Root
          collapsible
          multiple
          borderWidth="1px"
          borderColor="gray.200"
          rounded="xl"
          overflow="hidden"
          bg="white"
        >
          {items.map((item, index) => (
            <Accordion.Item key={item.question} value={String(index)}>
              <Accordion.ItemTrigger px="6" py="5">
                <Heading as="h3" size="sm" flex="1" textAlign="left">
                  {item.question}
                </Heading>

                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>

              <Accordion.ItemContent>
                <Accordion.ItemBody px="6" pb="6">
                  <Text color="gray.600" lineHeight="1.8">
                    {item.answer}
                  </Text>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Container>
    </Box>
  )
}
