import { Box, Container, Heading, List, Separator, Stack, Text } from '@chakra-ui/react'

function Section({ title, children }) {
  return (
    <Stack gap={5}>
      <Heading as="h2" size="lg">
        {title}
      </Heading>

      {children}
    </Stack>
  )
}

export default function CookiePolicyPage() {
  return (
    <Box as="main">
      <Box bg="gray.50" py={{ base: 16, md: 24 }} borderBottomWidth="1px">
        <Container maxW="4xl">
          <Stack gap={6}>
            <Heading as="h1" size="2xl">
              Политика использования Cookie
            </Heading>

            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" lineHeight="1.8">
              Настоящая Политика объясняет, какие файлы Cookie использует сервис Uchop, для каких
              целей они необходимы и каким образом пользователь может управлять их использованием.
            </Text>

            <Text color="gray.500" fontSize="sm">
              Редакция от 31 июля 2026 года
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container maxW="4xl" py={{ base: 16, md: 24 }}>
        <Stack gap={10}>
          <Section title="1. Что такое Cookie">
            <Text color="gray.600" lineHeight="1.8">
              Cookie — это небольшие текстовые файлы, которые сохраняются в браузере пользователя
              при посещении сайта. Они позволяют поддерживать работу сервиса, сохранять параметры
              пользовательской сессии и обеспечивать безопасность авторизации.
            </Text>
          </Section>

          <Separator />

          <Section title="2. Какие Cookie использует Uchop">
            <Text color="gray.600" lineHeight="1.8">
              В настоящее время Uchop использует только обязательные технические Cookie, необходимые
              для функционирования сайта и личного кабинета.
            </Text>

            <List.Root gap={2}>
              <List.Item>поддержание авторизации пользователя;</List.Item>

              <List.Item>сохранение безопасной пользовательской сессии;</List.Item>

              <List.Item>регистрация и вход в учетную запись;</List.Item>

              <List.Item>защита от несанкционированного доступа;</List.Item>

              <List.Item>обеспечение корректной работы CRM и личного кабинета.</List.Item>
            </List.Root>
          </Section>

          <Separator />

          <Section title="3. Для чего используются Cookie">
            <Text color="gray.600" lineHeight="1.8">
              Используемые Cookie являются необходимыми для предоставления доступа к сервису.
            </Text>

            <Text color="gray.600" lineHeight="1.8">
              Без них невозможно обеспечить безопасную регистрацию, вход пользователя, сохранение
              авторизации между запросами и защиту учетной записи.
            </Text>

            <Text color="gray.600" lineHeight="1.8">
              Uchop не использует Cookie для показа рекламы, создания рекламных профилей или
              отслеживания действий пользователей на сторонних сайтах.
            </Text>
          </Section>

          <Separator />

          <Section title="4. Управление Cookie">
            <Text color="gray.600" lineHeight="1.8">
              Пользователь может удалить или ограничить использование Cookie через настройки своего
              браузера.
            </Text>

            <Text color="gray.600" lineHeight="1.8">
              Следует учитывать, что отключение обязательных Cookie может привести к невозможности
              регистрации, входа в аккаунт, сохранения авторизации и использования отдельных функций
              сервиса.
            </Text>
          </Section>

          <Separator />

          <Section title="5. Изменение настоящей Политики">
            <Text color="gray.600" lineHeight="1.8">
              Администрация вправе изменять настоящую Политику использования Cookie при изменении
              функциональности сервиса, внедрении новых технологий или изменении требований
              законодательства.
            </Text>

            <Text color="gray.600" lineHeight="1.8">
              Актуальная редакция Политики всегда публикуется на данной странице и вступает в силу с
              момента ее размещения.
            </Text>
          </Section>

          <Separator />

          <Section title="Контакты">
            <Text color="gray.600" lineHeight="1.8">
              Если у вас возникли вопросы относительно использования файлов Cookie, вы можете
              связаться с администрацией сервиса Uchop через форму обратной связи или по адресу
              электронной почты, указанному в разделе «Контакты».
            </Text>
          </Section>
        </Stack>
      </Container>
    </Box>
  )
}
