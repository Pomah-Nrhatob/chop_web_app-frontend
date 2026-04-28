import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import { Combobox, createListCollection, Portal } from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export default function SelectSecurity() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedSecurityIds, setSelectedSecurityIds] = useState([]) // ✅ ID вместо объектов
  const { data: securities = [], isLoading } = useGetDictionarySecurities()

  const filteredItems = useMemo(
    () =>
      securities.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.surname.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [securities, searchValue]
  )

  const collection = useMemo(
    () =>
      createListCollection({
        items: filteredItems,
        itemToString: (item) => `${item.name} ${item.surname}`, // ✅ Что показывать
        itemToValue: (item) => String(item.id), // ✅ Что сохранять в value
      }),
    [filteredItems]
  )

  const handleValueChange = (details) => {
    setSelectedSecurityIds(details.value) // ✅ Массив строк ID
    console.log('Selected IDs:', details.value)
  }

  const selectedSecurities = useMemo(
    () =>
      selectedSecurityIds.map((id) => securities.find((s) => String(s.id) === id)).filter(Boolean),
    [selectedSecurityIds, securities]
  )

  return (
    <Combobox.Root
      multiple
      width="320px"
      value={selectedSecurityIds} // ✅ Массив строк ID
      collection={collection}
      onValueChange={handleValueChange}
      onInputValueChange={(details) => setSearchValue(details.inputValue)}
      openOnClick
    >
      <Combobox.Label>Выбор охранника</Combobox.Label>
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
                <Combobox.Item disabled>Загрузка...</Combobox.Item>
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
  )
}
