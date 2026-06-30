import { useGetDictionarySecurityPosition } from '@/features/dictionary/api/use-get-dictionary-securityPosition'
import { CloseButton, Combobox, createListCollection, Portal, Text } from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export default function SelectSecurityPositions({ value, onChange, error, isDisabled }) {
  const [searchValue, setSearchValue] = useState('')
  const { data: positions = [], isLoading } = useGetDictionarySecurityPosition()

  const filteredItems = useMemo(
    () => positions.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase())),
    [positions, searchValue]
  )

  const collection = useMemo(
    () =>
      createListCollection({
        items: filteredItems,
        itemToString: (item) => item.name,
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
        <Text fontWeight="medium">Выбор должности</Text>
        <Text fontSize={10} color="red.500">
          Настройте список должностей в разделе "Компании"
        </Text>
        <Combobox.Control>
          <Combobox.Input placeholder="Выберите должность" />
          <Combobox.IndicatorGroup gap="0.5" alignItems="center">
            {value && !isDisabled && (
              <CloseButton
                size="sm"
                onClick={handleClear}
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
                <Combobox.ItemGroupLabel>Должности</Combobox.ItemGroupLabel>

                {isLoading ? (
                  <Text>Загрузка...</Text>
                ) : filteredItems.length ? (
                  filteredItems.map((item) => (
                    <Combobox.Item key={item.id} item={item}>
                      {item.name}
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  ))
                ) : (
                  <Combobox.Empty>Должности не найдены</Combobox.Empty>
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
