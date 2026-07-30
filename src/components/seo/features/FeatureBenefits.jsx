import { Box, Container, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { HiCalendar, HiTable } from 'react-icons/hi'
import { HiBuildingOffice2, HiShieldCheck, HiUsers } from 'react-icons/hi2'

const icons = {
  building: HiBuildingOffice2,
  users: HiUsers,
  shield: HiShieldCheck,
  table: HiTable,
  calendar: HiCalendar,
}

export default function FeatureBenefits({
  title = 'Всё необходимое для управления компаниями',
  description = 'Создавайте компании, приглашайте сотрудников и управляйте правами доступа из одного аккаунта.',
  items = [],
}) {
  if (!items.length) {
    return null
  }

  return (
    <Box as="section" bg="gray.50" borderBottomWidth="1px" borderColor="gray.200">
      <Container
        maxW="6xl"
        py={{
          base: 16,
          md: 24,
        }}
      >
        <Stack
          gap={{
            base: 12,
            md: 16,
          }}
        >
          <Stack align="center" textAlign="center" gap="4">
            <Heading
              maxW="700px"
              color="gray.900"
              lineHeight="1.2"
              fontWeight="700"
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
              lineHeight="1.8"
            >
              {description}
            </Text>
          </Stack>

          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(3, 1fr)',
            }}
            gap="6"
          >
            {items.map((item) => {
              const IconComponent = icons[item.icon]
              return (
                <Box
                  key={item.title}
                  bg="white"
                  borderWidth="1px"
                  borderColor="gray.200"
                  rounded="2xl"
                  p={{
                    base: 6,
                    md: 8,
                  }}
                  transition="all .2s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'lg',
                    borderColor: 'blue.200',
                  }}
                >
                  <Stack gap="5">
                    <HStack
                      w="14"
                      h="14"
                      justify="center"
                      rounded="2xl"
                      bg="blue.50"
                      color="blue.600"
                    >
                      <IconComponent size={28} />
                    </HStack>

                    <Heading size="md" color="gray.900" lineHeight="1.3">
                      {item.title}
                    </Heading>

                    <Text color="gray.600" lineHeight="1.8">
                      {item.description}
                    </Text>
                  </Stack>
                </Box>
              )
            })}
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
}
