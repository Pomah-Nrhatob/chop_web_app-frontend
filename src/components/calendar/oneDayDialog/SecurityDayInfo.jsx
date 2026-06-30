import { WORKDAY_OPTIONS } from '@/components/calendar/data/workday-options'
import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import SelectSecurity from '@/features/dictionary/components/selectWithSearch/SelectSecurity'
import { useGetSecurityByIdApi } from '@/features/security/api/use-get-security-by-id-api'
import {
  Badge,
  Box,
  Card,
  Checkbox,
  createListCollection,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { memo, useState, useEffect } from 'react'
import { IoMdUndo } from 'react-icons/io'
import { MdDeleteOutline } from 'react-icons/md'

const SecurityDayInfo = memo(function SecurityDayInfo({
  isDeleted,
  worker,
  isEditing,
  addNewWorkday,
  markForDeletion,
  updateWorkday,
  isNewWorkday = false,
  isEdited = false,
  objectId,
}) {
  const { data: securities = [] } = useGetDictionarySecurities()

  const [isDisableDelete, setIsDiableDelete] = useState(worker.isStarted || worker.isFinished)

  useEffect(() => {
    setIsDiableDelete(worker.isStarted || worker.isFinished)
  }, [isEditing])

  // const isDisableDelete = worker.isStarted || worker.isFinished

  const collection = createListCollection({
    items: Object.values(WORKDAY_OPTIONS),
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })

  const { fetchSecurity, isLoading: loadingSecurityInfo } = useGetSecurityByIdApi()

  // Локальное состояние для полей, которые хотим обновлять на onBlur
  const [localShiftSalary, setLocalShiftSalary] = useState(worker.shiftSalary ?? 0)
  const [localStartedComment, setLocalStartedComment] = useState(worker.isStartedComment || '')
  const [localFinishedComment, setLocalFinishedComment] = useState(worker.isFinishedComment || '')

  // Синхронизация локального состояния с внешним при изменении worker
  useEffect(() => {
    setLocalShiftSalary(worker.shiftSalary ?? 0)
    setLocalStartedComment(worker.isStartedComment || '')
    setLocalFinishedComment(worker.isFinishedComment || '')
  }, [worker.shiftSalary, worker.isStartedComment, worker.isFinishedComment])

  const handleChangeSecurity = async (id) => {
    const securityId = id[0]
    updateWorkday(worker.id, { securityId })

    try {
      const result = await fetchSecurity(securityId)
      if (result.shiftSalary) {
        updateWorkday(worker.id, { shiftSalary: result.shiftSalary })
        setLocalShiftSalary(result.shiftSalary) // Обновляем локальное состояние
      }
    } catch (error) {
      console.error('Ошибка загрузки данных охранника:', error)
      updateWorkday(worker.id, { shiftSalary: 0 })
      setLocalShiftSalary(0)
    }
  }

  const getSecurityName = (securityId) => {
    const security = securities.find((sec) => sec.id === securityId)
    return security ? `${security.name} ${security.surname}` : `Охранник #${securityId}`
  }

  const sectionLabelProps = {
    fontSize: 'xs',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'gray.500',
    mb: 1,
  }

  return (
    <Card.Root
      key={worker.id}
      variant="outline"
      bg={
        isDeleted
          ? 'gray.50'
          : worker.isStarted
            ? 'green.50'
            : worker.isFinished
              ? 'blue.50'
              : 'white'
      }
      opacity={isDeleted ? 0.6 : 1}
      borderColor={isDeleted ? 'gray.300' : undefined}
      position="relative"
      transition="all 0.2s"
      borderLeftWidth={isEdited ? '4px' : undefined}
      borderLeftColor={isEdited ? 'orange.400' : undefined}
      overflow="hidden"
      shadow="sm"
    >
      <Card.Body mb={5} p={{ base: 3, md: 4 }}>
        {isEdited && (
          <Badge
            position="absolute"
            bottom={{ base: 2, md: 3 }}
            right={{ base: 2, md: 3 }}
            colorPalette="orange"
            size="sm"
            variant="solid"
          >
            Изменено
          </Badge>
        )}

        {isEditing && (
          <IconButton
            disabled={isDisableDelete}
            position="absolute"
            top={{ base: 2, md: 4 }}
            right={{ base: 2, md: 4 }}
            aria-label={isDeleted ? 'Вернуть' : 'Удалить'}
            colorPalette={isDeleted ? 'green' : 'red'}
            size={{ base: 'xs', md: 'sm' }}
            minW={{ base: '32px', md: '40px' }}
            h={{ base: '32px', md: '40px' }}
            onClick={() => markForDeletion(worker.id)}
            zIndex={1}
          >
            {isDeleted ? <IoMdUndo /> : <MdDeleteOutline />}
          </IconButton>
        )}

        <Stack spacing={{ base: 4, md: 5 }}>
          <Box>
            <Text {...sectionLabelProps}>Охранник</Text>
            {isNewWorkday ? (
              <Box maxW={{ base: '70%', md: '320px' }}>
                <SelectSecurity
                  objectId={objectId ? objectId : null}
                  title={null}
                  multiple={false}
                  value={worker.securityId ? [worker.securityId] : []}
                  onChange={handleChangeSecurity}
                  placeholder="Выберите охранника"
                  inputOnTop
                />
              </Box>
            ) : (
              <Text
                fontWeight="semibold"
                textDecoration={isDeleted ? 'line-through' : 'none'}
                color={isDeleted ? 'gray.500' : 'gray.800'}
                fontSize={{ base: 'sm', md: 'md' }}
              >
                {getSecurityName(worker.securityId)}
              </Text>
            )}
          </Box>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 4, md: 5 }}>
            <GridItem>
              <Text {...sectionLabelProps}>Тип дня</Text>

              {isEditing ? (
                <Box maxW={{ base: '70%', md: '220px' }}>
                  <Select.Root
                    width="100%"
                    collection={collection}
                    value={worker.workdayStatus ? [worker.workdayStatus] : []}
                    onValueChange={(details) => {
                      updateWorkday(worker.id, { workdayStatus: details.value[0] })
                    }}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Выберите тип дня" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>

                    <Select.Positioner>
                      <Select.Content>
                        {collection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Box>
              ) : (
                <Badge variant="outline" colorPalette="gray">
                  {WORKDAY_OPTIONS[worker.workdayStatus]?.label || 'Не выбран'}
                </Badge>
              )}
            </GridItem>

            <GridItem>
              <Text {...sectionLabelProps}>Оплата</Text>

              {isEditing ? (
                <Box maxW={{ base: '70%', md: '180px' }}>
                  {loadingSecurityInfo ? (
                    <HStack py={2}>
                      <Spinner size="sm" color="gray" />
                      <Text fontSize="sm" color="gray.500">
                        Загрузка...
                      </Text>
                    </HStack>
                  ) : (
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Введите сумму"
                      value={localShiftSalary}
                      onChange={(e) =>
                        setLocalShiftSalary(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      onBlur={() =>
                        updateWorkday(worker.id, {
                          shiftSalary: localShiftSalary,
                        })
                      }
                    />
                  )}
                </Box>
              ) : (
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: 'sm', md: 'md' }}
                  color={
                    isDeleted ? 'gray.500' : worker.shiftSalary < 1500 ? 'orange.600' : 'green.600'
                  }
                  textDecoration={isDeleted ? 'line-through' : 'none'}
                >
                  {worker.shiftSalary} ₽
                </Text>
              )}
            </GridItem>
          </Grid>

          <Box>
            <Text {...sectionLabelProps}>Статус дня</Text>

            {isEditing ? (
              <VStack align="stretch" spacing={3}>
                <HStack
                  p={3}
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  bg="white"
                  justify="space-between"
                  flexWrap="wrap"
                >
                  <Checkbox.Root
                    checked={!!worker.isStarted}
                    onCheckedChange={(details) => {
                      updateWorkday(worker.id, { isStarted: !!details.checked })
                    }}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label>День начал</Checkbox.Label>
                  </Checkbox.Root>

                  <Badge variant={worker.isStarted ? 'solid' : 'outline'} colorPalette="green">
                    {worker.isStarted ? 'Активен' : 'Не активен'}
                  </Badge>
                </HStack>

                <HStack
                  p={3}
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  bg="white"
                  justify="space-between"
                  flexWrap="wrap"
                >
                  <Checkbox.Root
                    checked={!!worker.isFinished}
                    onCheckedChange={(details) => {
                      updateWorkday(worker.id, { isFinished: !!details.checked })
                    }}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label>День закончил</Checkbox.Label>
                  </Checkbox.Root>

                  <Badge variant={worker.isFinished ? 'solid' : 'outline'} colorPalette="blue">
                    {worker.isFinished ? 'Завершён' : 'В процессе'}
                  </Badge>
                </HStack>
              </VStack>
            ) : (
              <VStack align="stretch" spacing={2}>
                <HStack spacing={2} align="start" flexWrap="wrap">
                  <Badge
                    colorScheme={worker.isStarted ? 'green' : 'gray'}
                    variant={worker.isStarted ? 'solid' : 'outline'}
                    opacity={isDeleted ? 0.6 : 1}
                    fontSize={{ base: 'xs', md: 'sm' }}
                  >
                    {worker.isStarted ? 'Начал работу' : 'Не начал'}
                  </Badge>
                  {worker.isStartedComment && (
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      noOfLines={2}
                      opacity={isDeleted ? 0.6 : 1}
                    >
                      ({worker.isStartedComment})
                    </Text>
                  )}
                </HStack>

                <HStack spacing={2} align="start" flexWrap="wrap">
                  <Badge
                    colorScheme={worker.isFinished ? 'blue' : 'gray'}
                    variant={worker.isFinished ? 'solid' : 'outline'}
                    opacity={isDeleted ? 0.6 : 1}
                    fontSize={{ base: 'xs', md: 'sm' }}
                  >
                    {worker.isFinished ? 'Завершил' : 'Не завершил'}
                  </Badge>
                  {worker.isFinishedComment && (
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      noOfLines={2}
                      opacity={isDeleted ? 0.6 : 1}
                    >
                      ({worker.isFinishedComment})
                    </Text>
                  )}
                </HStack>
              </VStack>
            )}
          </Box>

          {isEditing && (
            <>
              <Box>
                <Text {...sectionLabelProps}>Комментарии</Text>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>
                      Комментарий к началу
                    </Text>
                    <Textarea
                      placeholder="Комментарий к началу дня"
                      value={localStartedComment}
                      resize="vertical"
                      minH="88px"
                      onChange={(e) => setLocalStartedComment(e.target.value)}
                      onBlur={() =>
                        updateWorkday(worker.id, { isStartedComment: localStartedComment })
                      }
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>
                      Комментарий к завершению
                    </Text>
                    <Textarea
                      placeholder="Комментарий к завершению дня"
                      value={localFinishedComment}
                      resize="vertical"
                      minH="88px"
                      onChange={(e) => setLocalFinishedComment(e.target.value)}
                      onBlur={() =>
                        updateWorkday(worker.id, { isFinishedComment: localFinishedComment })
                      }
                    />
                  </Box>
                </VStack>
              </Box>
            </>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  )
})

export default SecurityDayInfo
