import Link from 'next/link'

import { Box, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box as="footer" bg="gray.900" color="white">
      <Container maxW="7xl" py={{ base: 16, md: 20 }}>
        <Grid
          templateColumns={{
            base: '1fr',
            md: '2fr 1fr 1fr 1fr',
          }}
          gap={10}
        >
          <Stack gap={4}>
            <Heading size="md">Uchop</Heading>

            <Text color="gray.400" lineHeight="1.8">
              Сервис для управления персоналом, составления графиков, учета рабочего времени и
              автоматизации расчета заработной платы.
            </Text>
          </Stack>

          <Stack gap={4}>
            <Heading size="sm">Продукт</Heading>

            <Stack gap={2}>
              <Link href="/features">Возможности</Link>
              <Link href="/solutions">Решения</Link>
              <Link href="/use-cases">Сценарии использования</Link>
              {/* <Link href="/pricing">Цены</Link> */}
            </Stack>
          </Stack>

          <Stack gap={4}>
            <Heading size="sm">Возможности</Heading>

            <Stack gap={2}>
              <Link href="/features/company-management">Управление компанией</Link>

              <Link href="/features/employees-and-objects">Сотрудники и объекты</Link>

              <Link href="/features/schedule-management">Графики работы</Link>

              <Link href="/features/employee-monitoring">Контроль сотрудников</Link>

              <Link href="/features/payroll">Расчет зарплаты</Link>
            </Stack>
          </Stack>

          <Stack gap={4}>
            <Heading size="sm">Контакты</Heading>

            <Stack gap={2}>
              <Text color="gray.400">yourchop@uchop.ru</Text>

              <Text color="gray.400">+7 (968) 758-87-13</Text>

              <Link href="/privacy-policy">Политика конфиденциальности</Link>

              <Link href="/terms">Пользовательское соглашение</Link>
            </Stack>
          </Stack>
        </Grid>

        <Box mt={16} pt={8} borderTop="1px solid" borderColor="whiteAlpha.200">
          <Text textAlign="center" color="gray.500" fontSize="sm">
            © {new Date().getFullYear()} Uchop. Все права защищены.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}
