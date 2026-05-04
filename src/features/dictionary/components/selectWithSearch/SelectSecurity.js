import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import {
  Combobox,
  createListCollection,
  Portal,
  Text,
  Tag,
  Button,
  Flex,
  Box,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export default function SelectSecurity({ value = [], onChange, error }) {
  const [searchValue, setSearchValue] = useState('')
  const { data: securities = [], isLoading } = useGetDictionarySecurities()

  // Найдём выбранных охранников из `value` (массив ID)
  const selectedSecurities = useMemo(() => {
    if (!value || !Array.isArray(value)) return []
    return value.map((id) => securities.find((security) => security.id === id)).filter(Boolean)
  }, [value, securities])

  const filteredItems = useMemo(
    () =>
      securities.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
          // Показываем только тех, кто ещё не выбран
          !value.includes(item.id)
      ),
    [securities, searchValue, value]
  )

  const collection = useMemo(
    () =>
      createListCollection({
        items: filteredItems,
        itemToString: (item) => `${item.name} ${item.surname}`,
        itemToValue: (item) => item.id,
      }),
    [filteredItems]
  )

  const handleRemove = (idToRemove) => {
    onChange(value.filter((id) => id !== idToRemove))
  }

  const handleValueChange = (details) => {
    // details.value — массив ID
    onChange(details.value)
  }

  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={2}>
        Выбор охранников
      </Text>

      {/* Отображение выбранных охранников сверху */}
      {selectedSecurities.length > 0 && (
        <Flex mb={2} gap={3}>
          {selectedSecurities.map((security) => (
            <Tag.Root px={3} py={1} key={security.id} size="lg">
              <Tag.Label>
                {security.name} {security.surname}
              </Tag.Label>
              <Tag.EndElement>
                <Tag.CloseTrigger onClick={() => handleRemove(security.id)} />
              </Tag.EndElement>
            </Tag.Root>
          ))}
        </Flex>
      )}

      <Combobox.Root
        autoFocus={false}
        multiple
        // width="320px"
        value={value}
        collection={collection}
        onValueChange={handleValueChange}
        onInputValueChange={(details) => setSearchValue(details.inputValue)}
        openOnClick
        invalid={!!error}
      >
        {/* <Combobox.Label>Выбор охранников</Combobox.Label> */}
        <Combobox.Control>
          <Combobox.Input placeholder="Выберите охранников" />
          <Combobox.IndicatorGroup>
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.ItemGroup>
                <Combobox.ItemGroupLabel>Охранники</Combobox.ItemGroupLabel>
                {isLoading ? (
                  <Text>Загрузка...</Text>
                ) : filteredItems.length ? (
                  filteredItems.map((item) => (
                    <Combobox.Item key={item.id} item={item}>
                      {item.name} {item.surname}
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  ))
                ) : (
                  <Combobox.Empty>Охранники не найдены</Combobox.Empty>
                )}
              </Combobox.ItemGroup>
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error.message}
        </Text>
      )}
    </Box>
  )
}
