import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import { Combobox, createListCollection, Portal, Text, Tag, Flex, Box } from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export default function SelectSecurity({
  value = [],
  onChange,
  error,
  multiple = true,
  placeholder = 'Выберите охранников',
  title = 'Выбор охранников',
  inputOnTop = false,
}) {
  const [searchValue, setSearchValue] = useState('')
  const { data: securities = [], isLoading } = useGetDictionarySecurities()

  // Найдём выбранных охранников из `value` (массив ID)
  const selectedSecurities = useMemo(() => {
    if (!value || !Array.isArray(value)) return []
    return value.map((id) => securities.find((security) => security.id === id)).filter(Boolean)
  }, [value, securities])

  const filteredItems = useMemo(
    () =>
      securities
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.surname.toLowerCase().includes(searchValue.toLowerCase())
        )
        // Для multiple: исключаем уже выбранные из списка
        // Для single: показываем все (можно сменить выбор на другого)
        .filter((item) => !multiple || !value.includes(item.id)),
    [securities, searchValue, value, multiple]
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
    // details.value — массив ID (даже для single-select!)
    onChange(details.value)
  }

  return (
    <Box>
      {title && (
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          {title}
        </Text>
      )}

      <Flex gap={2} flexDirection={inputOnTop ? 'column-reverse' : 'column'}>
        {/* 👇 Отображение выбранных охранников сверху — ТОЛЬКО для multiple */}
        {selectedSecurities.length > 0 && (
          <Flex gap={2} wrap="wrap">
            {selectedSecurities.map((security) => (
              <Tag.Root key={security.id} size="md">
                <Tag.Label>
                  {security.name} {security.surname}
                </Tag.Label>
                {multiple && (
                  <Tag.EndElement>
                    <Tag.CloseTrigger onClick={() => handleRemove(security.id)} />
                  </Tag.EndElement>
                )}
              </Tag.Root>
            ))}
          </Flex>
        )}

        <Combobox.Root
          autoFocus={false}
          multiple={multiple}
          value={value}
          collection={collection}
          onValueChange={handleValueChange}
          onInputValueChange={(details) => setSearchValue(details.inputValue)}
          openOnClick
          invalid={!!error}
        >
          <Combobox.Control>
            <Combobox.Input
              placeholder={placeholder}
              // 👇 Для single-select: readOnly, чтобы нельзя было вводить текст вручную
              // (выбор только из выпадающего списка, как в классическом <select>)
              readOnly={!multiple}
            />
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
                    <Text px={4} py={2}>
                      Загрузка...
                    </Text>
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
      </Flex>
    </Box>
  )
}
