import NextLink from 'next/link'
import { Box, Container, Flex, Heading, Link, List, Separator, Stack, Text } from '@chakra-ui/react'

export const metadata = {
  title: 'Политика обработки персональных данных — Uchop',
  description: 'Политика обработки персональных данных пользователей сайта и сервиса Uchop.',
  alternates: {
    canonical: 'https://uchop.ru/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const sections = [
  {
    id: 'general',
    title: '1. Общие положения',
  },
  {
    id: 'operator',
    title: '2. Оператор персональных данных',
  },
  {
    id: 'data',
    title: '3. Какие данные обрабатываются',
  },
  {
    id: 'purposes',
    title: '4. Цели обработки персональных данных',
  },
  {
    id: 'legal-basis',
    title: '5. Правовые основания обработки',
  },
  {
    id: 'processing',
    title: '6. Порядок обработки персональных данных',
  },
  {
    id: 'third-parties',
    title: '7. Передача персональных данных',
  },
  {
    id: 'storage',
    title: '8. Сроки обработки и хранения',
  },
  {
    id: 'rights',
    title: '9. Права пользователя',
  },
  {
    id: 'cookies',
    title: '10. Файлы Cookie',
  },
  {
    id: 'security',
    title: '11. Защита персональных данных',
  },
  {
    id: 'final',
    title: '12. Заключительные положения',
  },
  {
    id: 'contacts',
    title: '13. Контакты',
  },
]

const processedData = [
  'фамилия, имя и отчество;',
  'адрес электронной почты;',
  'номер телефона, если он указан пользователем;',
  'данные учетной записи;',
  'сведения, которые пользователь самостоятельно добавляет в сервис;',
  'IP-адрес;',
  'информация о браузере, операционной системе и устройстве;',
  'технические журналы работы сервиса;',
  'файлы Cookie и сведения о действиях пользователя на сайте.',
]

const processingPurposes = [
  'регистрация пользователя и создание учетной записи;',
  'предоставление доступа к функциям сервиса Uchop;',
  'идентификация и авторизация пользователя;',
  'исполнение Пользовательского соглашения;',
  'обеспечение работы личного кабинета;',
  'направление сервисных и технических уведомлений;',
  'обработка обращений и оказание технической поддержки;',
  'обеспечение безопасности сайта и предотвращение злоупотреблений;',
  'улучшение качества, надежности и удобства сервиса;',
  'анализ посещаемости сайта;',
  'выполнение обязанностей, установленных законодательством Российской Федерации.',
]

const processingOperations = [
  'сбор;',
  'запись;',
  'систематизация;',
  'накопление;',
  'хранение;',
  'уточнение и обновление;',
  'извлечение;',
  'использование;',
  'предоставление доступа в предусмотренных законом случаях;',
  'обезличивание;',
  'блокирование;',
  'удаление;',
  'уничтожение.',
]

const userRights = [
  'получать сведения об обработке своих персональных данных;',
  'требовать уточнения неполных, неточных или устаревших данных;',
  'требовать блокирования или удаления персональных данных при наличии законных оснований;',
  'отозвать согласие на обработку персональных данных;',
  'направить требование о прекращении обработки персональных данных;',
  'обжаловать действия или бездействие Оператора в Роскомнадзоре или в судебном порядке;',
  'осуществлять иные права, предусмотренные законодательством Российской Федерации.',
]

function PolicySection({ id, title, children }) {
  return (
    <Box as="section" id={id} scrollMarginTop="120px" py={{ base: 8, md: 10 }}>
      <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} lineHeight="1.3" mb={5}>
        {title}
      </Heading>

      <Stack gap={4}>{children}</Stack>
    </Box>
  )
}

function PolicyList({ items }) {
  return (
    <List.Root as="ul" ps={5} gap={2}>
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

function PolicyText({ children }) {
  return (
    <Text color="gray.700" lineHeight="1.8" fontSize={{ base: 'md', md: 'lg' }}>
      {children}
    </Text>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <Box as="main">
      <Box bg="gray.50" borderBottomWidth="1px" borderColor="gray.200" py={{ base: 12, md: 16 }}>
        <Container maxW="900px">
          <Stack gap={5}>
            <Text
              color="blue.600"
              fontSize="sm"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Юридическая информация
            </Text>

            <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} lineHeight="1.1" maxW="800px">
              Политика обработки персональных данных
            </Heading>

            <Text
              color="gray.600"
              fontSize={{ base: 'md', md: 'lg' }}
              lineHeight="1.8"
              maxW="760px"
            >
              Настоящая Политика определяет порядок обработки и защиты персональных данных
              пользователей сайта и сервиса Uchop.
            </Text>

            <Flex
              gap={{ base: 2, md: 6 }}
              direction={{ base: 'column', md: 'row' }}
              color="gray.500"
              fontSize="sm"
            >
              <Text>Дата публикации: 31 июля 2026 года</Text>
              <Text>Последнее обновление: 31 июля 2026 года</Text>
            </Flex>
          </Stack>
        </Container>
      </Box>

      <Container maxW="1200px" py={{ base: 12, md: 20 }}>
        <Flex
          align="flex-start"
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 10, lg: 16 }}
        >
          <Box
            as="nav"
            aria-label="Оглавление политики"
            position={{ base: 'static', lg: 'sticky' }}
            top="110px"
            flexShrink={0}
            width={{ base: '100%', lg: '280px' }}
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
                  lineHeight="1.5"
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
              <PolicyText>
                Uchop уважает право пользователей на неприкосновенность частной жизни и принимает
                необходимые меры для защиты персональных данных в соответствии с законодательством
                Российской Федерации.
              </PolicyText>
            </Box>

            <PolicySection id="general" title="1. Общие положения">
              <PolicyText>
                Настоящая Политика обработки персональных данных составлена в соответствии с
                Федеральным законом от 27 июля 2006 года № 152-ФЗ «О персональных данных» и
                определяет порядок обработки персональных данных, а также меры по обеспечению их
                безопасности.
              </PolicyText>

              <PolicyText>
                Политика применяется ко всей информации, которую Оператор может получить о
                посетителях сайта{' '}
                <Link
                  href="https://uchop.ru"
                  color="blue.600"
                  textDecoration="underline"
                  textUnderlineOffset="3px"
                >
                  uchop.ru
                </Link>{' '}
                и пользователях сервиса Uchop.
              </PolicyText>

              <PolicyText>
                Использование сайта и регистрация в сервисе означают, что пользователь ознакомился с
                настоящей Политикой. В случаях, когда законодательство требует отдельного согласия,
                такое согласие запрашивается у пользователя отдельно.
              </PolicyText>
            </PolicySection>

            <Separator />

            <PolicySection id="operator" title="2. Оператор персональных данных">
              <PolicyText>Оператором персональных данных является:</PolicyText>

              <Box
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="xl"
                p={{ base: 5, md: 6 }}
                bg="gray.50"
              >
                <Stack gap={2}>
                  <Text fontWeight="semibold">Игнатов Роман Николаевич</Text>
                  <Text color="gray.600">Сайт: https://uchop.ru</Text>
                  <Text color="gray.600">
                    Email:{' '}
                    <Link
                      href="mailto:garash96_2@mail.ru"
                      color="blue.600"
                      textDecoration="underline"
                      textUnderlineOffset="3px"
                    >
                      garash96_2@mail.ru
                    </Link>
                  </Text>
                  {/* 
                  <Text color="orange.700" fontSize="sm" pt={2}>
                    Перед публикацией добавьте статус ИП или ООО, ИНН, ОГРНИП или ОГРН и адрес
                    оператора, если эти сведения применимы.
                  </Text> */}
                </Stack>
              </Box>
            </PolicySection>

            <Separator />

            <PolicySection id="data" title="3. Какие данные обрабатываются">
              <PolicyText>
                Оператор может обрабатывать следующие категории персональных и технических данных:
              </PolicyText>

              <PolicyList items={processedData} />

              <PolicyText>
                Состав обрабатываемых данных зависит от того, какие функции сайта и сервиса
                использует пользователь.
              </PolicyText>

              <PolicyText>
                Данные о работниках, объектах, графиках и иных лицах, которые пользователь
                самостоятельно загружает в сервис, предоставляются пользователем под его
                ответственность. Пользователь обязан иметь законные основания для их передачи и
                обработки.
              </PolicyText>
            </PolicySection>

            <Separator />

            <PolicySection id="purposes" title="4. Цели обработки персональных данных">
              <PolicyText>Персональные данные обрабатываются в следующих целях:</PolicyText>

              <PolicyList items={processingPurposes} />
            </PolicySection>

            <Separator />

            <PolicySection id="legal-basis" title="5. Правовые основания обработки">
              <PolicyText>Правовыми основаниями обработки персональных данных являются:</PolicyText>

              <PolicyList
                items={[
                  'Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных»;',
                  'согласие субъекта персональных данных на обработку его персональных данных;',
                  'Пользовательское соглашение, заключаемое путем акцепта его условий на сайте;',
                  'необходимость заключения или исполнения договора, стороной которого является пользователь;',
                  'выполнение обязанностей, возложенных на Оператора законодательством Российской Федерации;',
                  'иные основания, предусмотренные законодательством Российской Федерации.',
                ]}
              />
            </PolicySection>

            <Separator />

            <PolicySection id="processing" title="6. Порядок обработки персональных данных">
              <PolicyText>
                Обработка персональных данных осуществляется с использованием средств автоматизации
                или без использования таких средств.
              </PolicyText>

              <PolicyText>
                Оператор может совершать следующие действия с персональными данными:
              </PolicyText>

              <PolicyList items={processingOperations} />

              <PolicyText>
                Обработка ограничивается достижением конкретных, заранее определенных и законных
                целей. Не допускается обработка данных, несовместимая с целями их сбора.
              </PolicyText>
            </PolicySection>

            <Separator />

            <PolicySection id="third-parties" title="7. Передача персональных данных">
              <PolicyText>
                Оператор не раскрывает персональные данные третьим лицам без законных оснований.
              </PolicyText>

              <PolicyText>Передача или предоставление доступа может осуществляться:</PolicyText>

              <PolicyList
                items={[
                  'с согласия пользователя;',
                  'для исполнения Пользовательского соглашения и предоставления функций сервиса;',
                  'поставщикам хостинга, электронной почты, аналитики и иной инфраструктуры, необходимой для работы Uchop;',
                  'по законному требованию суда, Роскомнадзора, правоохранительных или иных уполномоченных государственных органов;',
                  'в иных случаях, предусмотренных законодательством Российской Федерации.',
                ]}
              />

              <PolicyText>
                Привлекаемые поставщики услуг получают доступ только к тем данным, которые
                необходимы для выполнения соответствующих функций, и обязаны соблюдать требования
                конфиденциальности и безопасности.
              </PolicyText>
            </PolicySection>

            <Separator />

            <PolicySection id="storage" title="8. Сроки обработки и хранения">
              <PolicyText>
                Персональные данные обрабатываются не дольше, чем этого требуют цели их обработки,
                если иной срок не установлен законом или договором.
              </PolicyText>

              <PolicyText>Основаниями для прекращения обработки могут являться:</PolicyText>

              <PolicyList
                items={[
                  'достижение целей обработки;',
                  'истечение срока действия согласия;',
                  'отзыв согласия пользователем;',
                  'получение законного требования о прекращении обработки;',
                  'прекращение действия учетной записи или договора;',
                  'выявление неправомерной обработки.',
                ]}
              />

              <PolicyText>
                После прекращения обработки данные удаляются, уничтожаются или обезличиваются, если
                их дальнейшее хранение не требуется законодательством Российской Федерации.
              </PolicyText>
            </PolicySection>

            <Separator />

            <PolicySection id="rights" title="9. Права пользователя">
              <PolicyText>Пользователь имеет право:</PolicyText>

              <PolicyList items={userRights} />

              <PolicyText>
                Для реализации своих прав пользователь может направить обращение на электронную
                почту Оператора. В обращении рекомендуется указать имя, адрес электронной почты
                учетной записи и суть требования.
              </PolicyText>
            </PolicySection>

            <Separator />

            <PolicySection id="cookies" title="10. Файлы Cookie">
              <PolicyText>
                Сайт может использовать файлы Cookie и аналогичные технологии для обеспечения
                корректной и безопасной работы сервиса.
              </PolicyText>

              <PolicyText>Cookie могут использоваться для:</PolicyText>

              <PolicyList
                items={[
                  'авторизации пользователя;',
                  'сохранения настроек и состояния сеанса;',
                  'защиты сайта от злоупотреблений;',
                  'анализа посещаемости и улучшения работы сайта.',
                ]}
              />

              <PolicyText>
                Пользователь может ограничить или отключить Cookie в настройках браузера. В таком
                случае отдельные функции сайта или личного кабинета могут работать некорректно.
              </PolicyText>

              <PolicyText>
                Подробная информация может быть размещена в отдельной Политике использования Cookie.
              </PolicyText>
            </PolicySection>

            <Separator />

            <PolicySection id="security" title="11. Защита персональных данных">
              <PolicyText>
                Оператор принимает необходимые правовые, организационные и технические меры для
                защиты персональных данных.
              </PolicyText>

              <PolicyText>Меры защиты направлены на предотвращение:</PolicyText>

              <PolicyList
                items={[
                  'неправомерного или случайного доступа;',
                  'уничтожения, изменения или блокирования данных;',
                  'копирования, предоставления или распространения данных без законных оснований;',
                  'иных неправомерных действий с персональными данными.',
                ]}
              />
            </PolicySection>

            <Separator />

            <PolicySection id="final" title="12. Заключительные положения">
              <PolicyText>
                Оператор вправе изменять настоящую Политику при изменении законодательства, функций
                сервиса или порядка обработки персональных данных.
              </PolicyText>

              <PolicyText>
                Новая редакция вступает в силу с момента ее публикации на сайте, если иной срок не
                указан в самой редакции.
              </PolicyText>

              <PolicyText>
                Актуальная версия Политики постоянно доступна по адресу{' '}
                <Link
                  href="https://uchop.ru/privacy-policy"
                  color="blue.600"
                  textDecoration="underline"
                  textUnderlineOffset="3px"
                >
                  https://uchop.ru/privacy-policy
                </Link>
                .
              </PolicyText>
            </PolicySection>

            <Separator />

            <PolicySection id="contacts" title="13. Контакты">
              <PolicyText>
                По вопросам обработки персональных данных, актуализации данных, отзыва согласия или
                прекращения обработки пользователь может обратиться к Оператору:
              </PolicyText>

              <Box
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="xl"
                p={{ base: 5, md: 6 }}
              >
                <Stack gap={2}>
                  <Text fontWeight="semibold">Игнатов Роман Николаевич</Text>

                  <Text color="gray.600">
                    Email:{' '}
                    <Link
                      href="mailto:garash96_2@mail.ru"
                      color="blue.600"
                      textDecoration="underline"
                      textUnderlineOffset="3px"
                    >
                      garash96_2@mail.ru
                    </Link>
                  </Text>

                  <Text color="gray.600">Тема обращения: «Обработка персональных данных»</Text>
                </Stack>
              </Box>
            </PolicySection>

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
