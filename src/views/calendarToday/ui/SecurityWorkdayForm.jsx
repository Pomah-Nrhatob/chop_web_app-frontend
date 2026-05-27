// SecurityWorkdayForm.jsx
import { useEffect, useMemo, useState } from 'react'
import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import {
  Badge,
  Box,
  Checkbox,
  createListCollection,
  HStack,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { WORKDAY_OPTIONS } from '@/components/calendar/data/workday-options'

export default function SecurityWorkdayForm({ worker, updateWorkday }) {
  const [localShiftSalary, setLocalShiftSalary] = useState(worker.shiftSalary ?? 0)
  const [localStartedComment, setLocalStartedComment] = useState(worker.isStartedComment || '')
  const [localFinishedComment, setLocalFinishedComment] = useState(worker.isFinishedComment || '')

  useEffect(() => {
    setLocalShiftSalary(worker.shiftSalary ?? 0)
    setLocalStartedComment(worker.isStartedComment || '')
    setLocalFinishedComment(worker.isFinishedComment || '')
  }, [worker.shiftSalary, worker.isStartedComment, worker.isFinishedComment])

  const { data: securities = [] } = useGetDictionarySecurities()

  const securitiesMap = useMemo(() => {
    const map = new Map()
    securities.forEach((security) => {
      map.set(security.id, security)
    })
    return map
  }, [securities])

  // Ищем охранника по ID
  const security = securitiesMap.get(worker.securityId)

  const collection = createListCollection({
    items: Object.values(WORKDAY_OPTIONS),
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })

  return (
    <Box>
      {/* Информация об охраннике */}
      <Box mb={3}>
        <Text fontWeight="bold" fontSize="md" color="gray.700">
          {security ? `${security.name} ${security.surname}` : 'Охранник не найден'}
        </Text>
      </Box>

      {/* Статусы */}
      <VStack spacing={3} align="stretch">
        {/* Статус начала */}
        <Box p={3} borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white">
          <HStack justify="space-between" mb={2}>
            <HStack spacing={2}>
              <Checkbox.Root
                onCheckedChange={(details) => {
                  updateWorkday(worker.id, { isStarted: !!details.checked })
                }}
                checked={!!worker.isStarted}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Начал смену</Checkbox.Label>
              </Checkbox.Root>
            </HStack>
            <Badge
              variant={worker.isStarted ? 'solid' : 'outline'}
              colorPalette={worker.isStarted ? 'green' : 'gray'}
            >
              {worker.isStarted ? 'Активен' : 'Не активен'}
            </Badge>
          </HStack>

          <Textarea
            disabled={!worker?.isStarted}
            placeholder="Комментарий к началу смены"
            value={localStartedComment}
            onChange={(e) => setLocalStartedComment(e.target.value)}
            onBlur={() => updateWorkday(worker.id, { isStartedComment: localStartedComment })}
            resize="none"
            minH="60px"
            size="sm"
          />
        </Box>

        {/* Статус окончания */}
        <Box p={3} borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white">
          <HStack justify="space-between" mb={2}>
            <HStack spacing={2}>
              <Checkbox.Root
                onCheckedChange={(details) => {
                  updateWorkday(worker.id, { isFinished: !!details.checked })
                }}
                checked={!!worker.isFinished}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Завершил смену</Checkbox.Label>
              </Checkbox.Root>
            </HStack>
            <Badge
              variant={worker.isFinished ? 'solid' : 'outline'}
              colorPalette={worker.isFinished ? 'blue' : 'gray'}
            >
              {worker.isFinished ? 'Завершён' : 'В процессе'}
            </Badge>
          </HStack>

          <Textarea
            disabled={!worker?.isFinished}
            placeholder="Комментарий к завершению смены"
            value={localFinishedComment}
            resize="none"
            minH="60px"
            size="sm"
            onChange={(e) => setLocalFinishedComment(e.target.value)}
            onBlur={() => updateWorkday(worker.id, { isFinishedComment: localFinishedComment })}
          />
        </Box>

        {/* Оплата и тип дня */}
        <HStack spacing={4} wrap="wrap">
          <Box flex="1" minW="120px">
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Оплата
            </Text>
            <Input
              min={0}
              type="number"
              inputMode="numeric"
              placeholder="Сумма"
              value={localShiftSalary}
              onChange={(e) =>
                setLocalShiftSalary(e.target.value === '' ? '' : Number(e.target.value))
              }
              onBlur={() =>
                updateWorkday(worker.id, {
                  shiftSalary: localShiftSalary,
                })
              }
              size="sm"
            />
          </Box>

          <Box flex="1" minW="120px">
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Тип дня
            </Text>
            <Box maxW="100%">
              <Select.Root
                width="100%"
                collection={collection}
                value={worker.workdayStatus ? [worker.workdayStatus] : []}
                onValueChange={(details) => {
                  updateWorkday(worker.id, { workdayStatus: details.value[0] })
                }}
              >
                <Select.Control size="sm">
                  <Select.Trigger>
                    <Select.ValueText placeholder="Выберите тип" />
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
          </Box>
        </HStack>
      </VStack>
    </Box>
  )
}
