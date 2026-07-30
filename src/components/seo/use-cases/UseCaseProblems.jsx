import { Box, Card, Container, Heading, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { LuCircleAlert } from 'react-icons/lu'

export default function UseCaseProblems({ title, items }) {
  return (
    <Box
      as="section"
      py={{
        base: 16,
        md: 24,
      }}
      bg="gray.50"
    >
      <Container maxW="7xl">
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
            maxW="680px"
            color="gray.600"
            lineHeight="1.8"
            fontSize={{
              base: 'md',
              md: 'lg',
            }}
          >
            Эти проблемы ежедневно отнимают время руководителей и увеличивают нагрузку на персонал.
            Автоматизация помогает избавиться от рутинной работы и сделать процесс планирования
            предсказуемым.
          </Text>
        </Stack>

        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            xl: 3,
          }}
          gap="6"
        >
          {items.map((item) => (
            <Card.Root key={item.title} h="full" borderColor="gray.200" shadow="sm">
              <Card.Body>
                <Stack gap="5">
                  <Icon boxSize="6" color="red.500">
                    <LuCircleAlert />
                  </Icon>

                  <Heading size="md" lineHeight="1.3">
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
      </Container>
    </Box>
  )
}
