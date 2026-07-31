import NextLink from 'next/link'
import { Box, Container, Flex, Heading, Link, List, Separator, Stack, Text } from '@chakra-ui/react'

export const metadata = {
  title: 'Пользовательское соглашение - Uchop',
  description:
    'Официальное Пользовательское соглашение сервиса Uchop. Правила использования сайта, регистрации, личного кабинета, ответственность сторон и условия использования сервиса.',
  pathname: '/terms',
}

const sections = [
  {
    id: 'general',
    title: '1. Общие положения',
  },
  {
    id: 'subject',
    title: '2. Предмет соглашения',
  },
  {
    id: 'user-rights',
    title: '3. Права пользователя',
  },
  {
    id: 'admin-rights',
    title: '4. Права администрации',
  },
  {
    id: 'user-obligations',
    title: '5. Обязанности пользователя',
  },
  {
    id: 'admin-obligations',
    title: '6. Обязанности администрации',
  },
  {
    id: 'liability',
    title: '7. Ответственность сторон',
  },
  {
    id: 'agreement',
    title: '8. Условия действия соглашения',
  },
]

const userRights = [
  'осуществлять поиск информации на сайте;',
  'получать информацию, размещенную на сайте;',
  'создавать и размещать информацию в рамках функциональности сервиса;',
  'копировать информацию с обязательным указанием источника;',
  'использовать материалы сайта в личных некоммерческих целях;',
]

const adminRights = [
  'изменять функциональность сайта и сервиса;',
  'создавать, изменять или отменять правила использования сервиса;',
  'ограничивать доступ к информации и функциональности сайта;',
  'ограничивать или прекращать доступ пользователя при нарушении настоящего Соглашения;',
]

const userObligations = [
  'не нарушать работоспособность сайта;',
  'не использовать программы и скрипты для автоматизированного взаимодействия с сервисом;',
  'не предпринимать попыток получения несанкционированного доступа;',
  'соблюдать законодательство Российской Федерации;',
]

const adminObligations = [
  'поддерживать работоспособность сервиса, кроме случаев, не зависящих от Администрации;',
  'обеспечивать доступность Пользовательского соглашения;',
]

const liability = [
  'Администрация не несет ответственности за услуги, предоставляемые третьими лицами;',
  'Администрация не гарантирует бесперебойную работу сайта при возникновении обстоятельств непреодолимой силы;',
  'Администрация не гарантирует сохранность информации в случае форс-мажорных обстоятельств;',
]

function TermsSection({ id, title, children }) {
  return (
    <Box as="section" id={id} py={{ base: 8, md: 10 }} scrollMarginTop="120px">
      <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} mb={5}>
        {title}
      </Heading>

      <Stack gap={4}>{children}</Stack>
    </Box>
  )
}

function TermsText({ children }) {
  return (
    <Text color="gray.700" lineHeight="1.8" fontSize={{ base: 'md', md: 'lg' }}>
      {children}
    </Text>
  )
}

function TermsList({ items }) {
  return (
    <List.Root ps={5} gap={2}>
      {items.map((item) => (
        <List.Item key={item}>
          <Text color="gray.700" lineHeight="1.8">
            {item}
          </Text>
        </List.Item>
      ))}
    </List.Root>
  )
}

export default function TermsPage() {
  return (
    <Box as="main">
      <Box bg="gray.50" borderBottomWidth="1px" borderColor="gray.200" py={{ base: 12, md: 16 }}>
        <Container maxW="900px">
          <Stack gap={5}>
            <Text
              color="blue.600"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Юридическая информация
            </Text>

            <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} lineHeight="1.1" maxW="820px">
              Пользовательское соглашение
            </Heading>

            <Text
              color="gray.600"
              fontSize={{ base: 'md', md: 'lg' }}
              lineHeight="1.8"
              maxW="760px"
            >
              Настоящее Пользовательское соглашение регулирует порядок использования сайта и сервиса
              Uchop, права и обязанности Пользователей и Администрации.
            </Text>

            <Flex
              gap={{ base: 2, md: 6 }}
              direction={{ base: 'column', md: 'row' }}
              color="gray.500"
              fontSize="sm"
            >
              <Text>Редакция от 31 июля 2026 года</Text>

              <Text>Действует с момента публикации</Text>
            </Flex>
          </Stack>
        </Container>
      </Box>

      <Container maxW="1200px" py={{ base: 12, md: 20 }}>
        <Flex
          gap={{ base: 10, lg: 16 }}
          direction={{ base: 'column', lg: 'row' }}
          align="flex-start"
        >
          <Box
            as="nav"
            width={{ base: '100%', lg: '280px' }}
            flexShrink={0}
            position={{ base: 'static', lg: 'sticky' }}
            top="110px"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            bg="white"
            p={5}
          >
            <Heading as="h2" fontSize="md" mb={4}>
              Содержание
            </Heading>

            <Stack gap={2}>
              {sections.map((section) => (
                <Link
                  key={section.id}
                  asChild
                  color="gray.600"
                  fontSize="sm"
                  _hover={{
                    color: 'blue.600',
                    textDecoration: 'none',
                  }}
                >
                  <NextLink href={`#${section.id}`}>{section.title}</NextLink>
                </Link>
              ))}
            </Stack>
          </Box>

          <Box flex="1" minW={0} maxW="820px">
            <Box
              bg="blue.50"
              borderWidth="1px"
              borderColor="blue.100"
              borderRadius="xl"
              p={{ base: 5, md: 6 }}
              mb={8}
            >
              <TermsText>
                Используя сайт <strong>Uchop</strong>, регистрируя учетную запись или используя
                функциональность сервиса, Пользователь подтверждает ознакомление и согласие с
                условиями настоящего Пользовательского соглашения.
              </TermsText>
            </Box>

            <TermsSection id="general" title="1. Общие положения">
              <TermsText>
                Настоящее Пользовательское соглашение регулирует отношения между владельцем сайта
                https://uchop.ru (далее — Администрация) и пользователем сайта и сервиса Uchop.
              </TermsText>

              <TermsText>
                Использование сайта, регистрация учетной записи и использование любого функционала
                сервиса означает полное и безоговорочное принятие условий настоящего Соглашения.
              </TermsText>

              <TermsText>
                Если Пользователь не согласен с условиями настоящего Соглашения, он обязан
                прекратить использование сайта и сервиса.
              </TermsText>

              <TermsText>Сайт Uchop не является средством массовой информации.</TermsText>
            </TermsSection>

            <Separator />

            <TermsSection id="subject" title="2. Предмет соглашения">
              <TermsText>
                Администрация предоставляет Пользователю право использовать сайт и сервис Uchop
                посредством сети Интернет в соответствии с настоящим Соглашением.
              </TermsText>

              <TermsText>
                В рамках использования сервиса Пользователь может размещать следующую информацию:
              </TermsText>

              <TermsList
                items={[
                  'текстовую информацию;',
                  'ссылки на материалы, размещенные на сторонних интернет-ресурсах;',
                ]}
              />

              <TermsText>
                Администрация вправе изменять функциональность сайта и сервиса, добавлять новые
                возможности или прекращать поддержку отдельных функций без предварительного
                уведомления Пользователей.
              </TermsText>
            </TermsSection>

            <Separator />
            <TermsSection id="user-rights" title="3. Права пользователя">
              <TermsText>
                Пользователь вправе использовать сайт и сервис Uchop в соответствии с настоящим
                Соглашением и действующим законодательством Российской Федерации.
              </TermsText>

              <TermsList items={userRights} />

              <TermsText>
                Использование сервиса допускается исключительно законными способами и в пределах
                предоставленной функциональности.
              </TermsText>
            </TermsSection>

            <Separator />

            <TermsSection id="admin-rights" title="4. Права администрации">
              <TermsText>
                Администрация обеспечивает развитие и поддержку сервиса и вправе самостоятельно
                определять порядок его функционирования.
              </TermsText>

              <TermsList items={adminRights} />

              <TermsText>
                Администрация вправе без предварительного уведомления проводить технические работы,
                обновлять программное обеспечение и изменять внешний вид сайта, если это необходимо
                для развития, безопасности или стабильной работы сервиса.
              </TermsText>
            </TermsSection>

            <Separator />

            <TermsSection id="user-obligations" title="5. Обязанности пользователя">
              <TermsText>
                Пользователь обязуется соблюдать условия настоящего Соглашения при использовании
                сайта и сервиса Uchop.
              </TermsText>

              <TermsList items={userObligations} />

              <TermsText>
                Пользователь несет ответственность за достоверность размещаемой информации, а также
                за сохранность данных своей учетной записи, включая логин и пароль.
              </TermsText>

              <TermsText>
                Запрещается использовать сервис способом, который может привести к нарушению его
                работоспособности, созданию чрезмерной нагрузки либо нарушению прав других
                пользователей.
              </TermsText>
            </TermsSection>

            <Separator />

            <TermsSection id="admin-obligations" title="6. Обязанности администрации">
              <TermsText>
                Администрация принимает разумные меры для обеспечения стабильной работы сайта и
                сервиса.
              </TermsText>

              <TermsList items={adminObligations} />

              <TermsText>
                В случаях проведения технических работ, обновления оборудования или возникновения
                обстоятельств, не зависящих от Администрации, доступность сервиса может быть
                временно ограничена.
              </TermsText>
            </TermsSection>

            <Separator />

            <TermsSection id="liability" title="7. Ответственность сторон">
              <TermsText>
                Каждая сторона несет ответственность в пределах, предусмотренных законодательством
                Российской Федерации.
              </TermsText>

              <TermsList items={liability} />

              <TermsText>
                Администрация не несет ответственности за невозможность использования сервиса по
                причинам, не зависящим от нее, включая перебои в работе сети Интернет, действия
                операторов связи, поставщиков облачной инфраструктуры и иных третьих лиц.
              </TermsText>

              <TermsText>
                Пользователь самостоятельно отвечает за все действия, совершенные с использованием
                своей учетной записи, а также за последствия размещения информации в сервисе.
              </TermsText>
            </TermsSection>

            <Separator />

            <TermsSection id="agreement" title="8. Условия действия соглашения">
              <TermsText>
                Настоящее Пользовательское соглашение вступает в силу с момента первого
                использования сайта либо регистрации учетной записи.
              </TermsText>

              <TermsText>
                Администрация вправе изменять настоящее Соглашение в одностороннем порядке без
                предварительного уведомления Пользователей.
              </TermsText>

              <TermsText>
                Новая редакция вступает в силу с момента публикации на сайте, если иной срок не
                указан непосредственно в новой редакции Соглашения.
              </TermsText>

              <TermsText>
                Продолжение использования сайта или сервиса после публикации новой редакции означает
                согласие Пользователя с внесенными изменениями.
              </TermsText>

              <TermsText>
                Актуальная версия Пользовательского соглашения всегда доступна по адресу{' '}
                <Link asChild color="blue.600" textDecoration="underline" textUnderlineOffset="3px">
                  <NextLink href="/terms">https://uchop.ru/terms</NextLink>
                </Link>
                .
              </TermsText>
            </TermsSection>

            <Box pt={8}>
              <Text color="gray.500" fontSize="sm">
                Редакция от 31 июля 2026 года
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}
