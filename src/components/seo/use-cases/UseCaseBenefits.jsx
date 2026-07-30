import { Box, Card, Circle, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { LuCheck } from 'react-icons/lu'

export default function UseCaseBenefits({ title, items }) {
  return (
    <Box
      as="section"
      py={{
        base: 16,
        md: 24,
      }}
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
            maxW="760px"
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
            Автоматизация процессов помогает руководителям быстрее планировать работу, снижать
            количество ошибок и эффективнее управлять сотрудниками.
          </Text>
        </Stack>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
          }}
          gap="6"
        >
          {items.map((item) => (
            <Card.Root
              key={item.title}
              h="full"
              borderColor="gray.200"
              transition="all .2s"
              _hover={{
                shadow: 'md',
                borderColor: 'blue.300',
              }}
            >
              <Card.Body>
                <Stack gap="5">
                  <Circle size="12" bg="blue.50" color="blue.600">
                    <LuCheck size={24} />
                  </Circle>

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
        </Grid>
      </Container>
    </Box>
  )
}
