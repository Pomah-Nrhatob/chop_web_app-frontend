import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import { CloseButton, Combobox, createListCollection, Portal, Text } from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export default function SelectObject({ value, onChange, error, isDisabled, helpText }) {
  const [searchValue, setSearchValue] = useState('')
  const { data: objects = [], isLoading } = useGetDictionaryObjects()

  const filteredItems = useMemo(
    () => objects.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase())),
    [objects, searchValue]
  )

  const collection = useMemo(
    () =>
      createListCollection({
        items: filteredItems,
        itemToString: (item) => item.title,
        itemToValue: (item) => String(item.id),
      }),
    [filteredItems]
  )

  const handleClear = () => {
    onChange(null)
    setSearchValue('')
  }

  return (
    <>
      <Combobox.Root
        autoFocus={false}
        // width="320px"
        value={value ? [String(value)] : []}
        collection={collection}
        onValueChange={(details) => {
          const next = details.value?.[0] ? Number(details.value[0]) : null
          onChange(next)
        }}
        onInputValueChange={(details) => setSearchValue(details.inputValue)}
        openOnClick
        invalid={!!error}
        disabled={isDisabled}
      >
        <Text fontWeight="medium">Выбор объекта</Text>
        {helpText && (
          <Text fontSize={10} color="red.500">
            {helpText}
          </Text>
        )}
        <Combobox.Control>
          <Combobox.Input placeholder="Выберите объект" />

          <Combobox.IndicatorGroup gap="0.5" alignItems="center">
            {value && !isDisabled && (
              <CloseButton
                size="sm"
                onClick={handleClear}
                // position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
                zIndex={1}
              />
            )}
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>

        <Portal>
          <Combobox.Positioner>
            <Combobox.Content maxH="340px" overflowY="auto">
              <Combobox.ItemGroup>
                <Combobox.ItemGroupLabel>Объекты</Combobox.ItemGroupLabel>
                {isLoading ? (
                  <Text>Загрузка...</Text>
                ) : filteredItems.length ? (
                  filteredItems.map((item) => (
                    <Combobox.Item key={item.id} item={item}>
                      {item.title}
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  ))
                ) : (
                  <Combobox.Empty>Объекты не найдены</Combobox.Empty>
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
    </>
  )
}
