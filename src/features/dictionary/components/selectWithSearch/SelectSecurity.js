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
  isDisabled = false,
  objectId,
}) {
  const [searchValue, setSearchValue] = useState('')
  const { data: securities = [], isLoading } = useGetDictionarySecurities()

  // Найдём выбранных охранников из `value` (массив ID)
  const selectedSecurities = useMemo(() => {
    if (!value || !Array.isArray(value)) return []
    return value.map((id) => securities.find((security) => security.id === id)).filter(Boolean)
  }, [value, securities])

  const filteredItems = useMemo(() => {
    return securities
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.surname.toLowerCase().includes(searchValue.toLowerCase())
      )
      .filter((item) => !multiple || !value.includes(item.id))
  }, [securities, searchValue, value, multiple])

  const sortByStatus = (items) =>
    [...items].sort((a, b) => {
      const aDismissed = a.statusId === 3
      const bDismissed = b.statusId === 3

      if (aDismissed === bDismissed) return 0

      return aDismissed ? 1 : -1
    })

  const priorityItems = useMemo(() => {
    if (!objectId) return []

    return sortByStatus(filteredItems.filter((item) => item.objectId === objectId))
  }, [filteredItems, objectId])

  const otherItems = useMemo(() => {
    if (!objectId) {
      return sortByStatus(filteredItems)
    }

    return sortByStatus(filteredItems.filter((item) => item.objectId !== objectId))
  }, [filteredItems, objectId])

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
          disabled={isDisabled}
        >
          <Combobox.Control>
            <Combobox.Input
              placeholder={placeholder}
              // 👇 Для single-select: readOnly, чтобы нельзя было вводить текст вручную
              // (выбор только из выпадающего списка, как в классическом <select>)
              // readOnly={!multiple}
            />
            <Combobox.IndicatorGroup>
              <Combobox.Trigger />
            </Combobox.IndicatorGroup>
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner>
              <Combobox.Content maxH="340px" overflowY="auto">
                <Combobox.ItemGroup>
                  <Combobox.ItemGroupLabel>Охранники</Combobox.ItemGroupLabel>

                  {isLoading ? (
                    <Text px={4} py={2}>
                      Загрузка...
                    </Text>
                  ) : filteredItems.length ? (
                    <>
                      {priorityItems.map((item) => (
                        <Combobox.Item key={item.id} item={item}>
                          <Flex justify="space-between" align="center" w="full">
                            <Text>
                              {item.name} {item.surname}
                            </Text>

                            {item.statusId === 3 && (
                              <Tag.Root size="sm" colorPalette="red">
                                <Tag.Label>Уволен</Tag.Label>
                              </Tag.Root>
                            )}
                          </Flex>

                          <Combobox.ItemIndicator />
                        </Combobox.Item>
                      ))}

                      {objectId && priorityItems.length > 0 && otherItems.length > 0 && (
                        <Box borderTopWidth="1px" borderColor="gray.200" my={2} />
                      )}

                      {otherItems.map((item) => (
                        <Combobox.Item key={item.id} item={item}>
                          <Flex justify="space-between" align="center" w="full">
                            <Text>
                              {item.name} {item.surname}
                            </Text>

                            {item.statusId === 3 && (
                              <Tag.Root size="sm" colorPalette="red">
                                <Tag.Label>Уволен</Tag.Label>
                              </Tag.Root>
                            )}
                          </Flex>

                          <Combobox.ItemIndicator />
                        </Combobox.Item>
                      ))}
                    </>
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
