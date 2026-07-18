// src/components/calendar/oneDayDialog/OneDayVacationDialog.jsx
import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import { useGetOneSecurityWorkday } from '@/features/calendar/api/useGetOneSecurityWorkday'
import { useDeleteVacation } from '@/features/calendar/api/use-delete-vacation'
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
  VStack,
  HStack,
  Separator,
  Spinner,
  Box,
  Flex,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useActiveCompanyId } from '@/shared/hooks/useActiveCompanyId'

export default function OneDayVacationDialog({
  open,
  setOpen,
  selectedWorkday,
  setSelectedWorkday,
}) {
  const { isLoading, oneSecurityWorkdayInfo, isFetching } = useGetOneSecurityWorkday(
    selectedWorkday,
    {
      enabled: !!selectedWorkday && open,
    }
  )

  const activeCompanyId = useActiveCompanyId()

  const { mutate: deleteVacation, isPending: isDeletingVacation } = useDeleteVacation()

  const { data: securities = [], isLoading: loadingSecurities } =
    useGetDictionarySecurities(activeCompanyId)

  const foundSecurity = securities?.find((sec) => sec.id === oneSecurityWorkdayInfo?.securityId)

  const formatDate = (timestamp) => {
    try {
      return format(new Date(timestamp), 'dd MMMM yyyy г.', { locale: ru })
    } catch {
      return 'Неизвестная дата'
    }
  }

  const handleDeleteVacation = () => {
    if (!oneSecurityWorkdayInfo) return

    deleteVacation(oneSecurityWorkdayInfo.id, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  const isAllLoading = isLoading || isFetching || loadingSecurities

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      initialFocusEl={null}
      onExitComplete={() => {
        setSelectedWorkday(null)
      }}
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          display="flex"
          alignItems={{ base: 'flex-end', md: 'center' }}
          justifyContent="center"
          p={{ base: 0, md: 4 }}
        >
          <Dialog.Content
            w={{ base: '100vw', md: '600px' }}
            maxW="600px"
            maxH={{ base: '85dvh', md: '90dvh' }}
            borderTopRadius={{ base: 'l3', md: 'md' }}
            borderBottomRadius={{ base: 0, md: 'md' }}
            overflow="hidden"
            display="flex"
            flexDirection="column"
            bg="bg.panel"
            boxShadow="lg"
          >
            {/* ХЕДЕР */}
            <Dialog.Header flex="0 0 auto" px={6} py={4} position="relative">
              <Dialog.Title fontSize="xl" fontWeight="semibold">
                Информация об отпуске
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top={4} right={4} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Separator />

            {/* ТЕЛО */}
            <Dialog.Body
              flex="1 1 auto"
              overflowY="auto"
              overscrollBehavior="contain"
              px={6}
              py={5}
            >
              {isAllLoading ? (
                <VStack justify="center" align="center" h="200px" gap={3}>
                  <Spinner size="xl" color="blue.500" strokeWidth={3} />
                  <Text color="fg.muted" fontSize="sm">
                    Загрузка данных...
                  </Text>
                </VStack>
              ) : oneSecurityWorkdayInfo ? (
                <VStack align="stretch" gap={5}>
                  {/* Плашка с датой */}
                  <Box
                    bg="orange.50"
                    p={4}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="orange.200"
                  >
                    <HStack justify="space-between">
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color="orange.700"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Дата отпуска
                      </Text>
                      <Text fontSize="md" fontWeight="semibold" color="orange.900">
                        {formatDate(oneSecurityWorkdayInfo.timestamp)}
                      </Text>
                    </HStack>
                  </Box>

                  {/* Информация */}
                  <Box
                    bg="bg.muted"
                    p={5}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="border.subtle"
                  >
                    <VStack align="stretch" gap={4}>
                      <Flex align="center" gap={3}>
                        <Text fontSize="3xl">🏖</Text>
                        <VStack align="flex-start" gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="fg.main">
                            Отпуск
                          </Text>
                          <Text fontSize="sm" color="fg.muted">
                            Сотрудник находится в отпуске
                          </Text>
                        </VStack>
                      </Flex>

                      <Separator />

                      <HStack justify="space-between">
                        <Text fontSize="sm" color="fg.muted">
                          Сотрудник:
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color="fg.main">
                          {foundSecurity
                            ? `${foundSecurity.surname} ${foundSecurity.name}`
                            : `ID: ${oneSecurityWorkdayInfo.securityId}`}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Предупреждение */}
                  <Box
                    bg="blue.50"
                    p={3}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="blue.400"
                  >
                    <Text fontSize="sm" color="blue.800">
                      <strong>Внимание:</strong> Удаление этого дня отпуска позволит назначить смену
                      на эту дату.
                    </Text>
                  </Box>
                </VStack>
              ) : (
                <VStack justify="center" h="200px" gap={2}>
                  <Text color="fg.muted" fontSize="md" fontWeight="medium">
                    Данные отсутствуют
                  </Text>
                </VStack>
              )}
            </Dialog.Body>

            <Separator />

            {/* ФУТЕР */}
            <Dialog.Footer flex="0 0 auto" px={6} py={4} bg="bg.muted/30">
              <HStack
                justifyContent="flex-end"
                w="100%"
                gap={3}
                flexDirection={{ base: 'column-reverse', sm: 'row' }}
              >
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  w={{ base: '100%', sm: 'auto' }}
                  disabled={isDeletingVacation}
                >
                  Закрыть
                </Button>
                <Button
                  colorPalette="red"
                  onClick={handleDeleteVacation}
                  disabled={isDeletingVacation}
                  loading={isDeletingVacation}
                  w={{ base: '100%', sm: 'auto' }}
                  cursor="pointer"
                >
                  Удалить день отпуска
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
