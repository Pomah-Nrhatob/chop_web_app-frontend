import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import {
  createListCollection,
  Portal,
  Text,
  SelectRoot,
  SelectControl,
  SelectTrigger,
  SelectValueText,
  SelectIndicatorGroup,
  SelectIndicator,
  SelectPositioner,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export default function SelectOneObject({ value, onChange, error, isDisabled }) {
  const [searchValue, setSearchValue] = useState('')
  const { data: objects = [], isLoading } = useGetDictionaryObjects()

  // Поиск и фильтрация объектов (если нужно)
  const filteredItems = useMemo(
    () => objects.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase())),
    [objects, searchValue]
  )

  // Создаем коллекцию по правилам Chakra v3
  const collection = useMemo(
    () =>
      createListCollection({
        items: filteredItems,
        itemToString: (item) => item.title,
        itemToValue: (item) => String(item.id),
      }),
    [filteredItems]
  )

  return (
    <>
      <SelectRoot
        collection={collection}
        // Безопасно приводим числовой ID к строке внутри массива для Chakra UI v3
        value={value ? [String(value)] : []}
        disabled={isDisabled}
        invalid={!!error}
        onValueChange={(details) => {
          // Извлекаем выбранное значение и возвращаем его родителю как число
          const selectedId = details.value?.[0] ? Number(details.value[0]) : null
          onChange(selectedId)
        }}
      >
        <SelectControl>
          <SelectTrigger>
            <SelectValueText placeholder="Выберите объект охраны" />
          </SelectTrigger>
          <SelectIndicatorGroup>
            <SelectIndicator />
          </SelectIndicatorGroup>
        </SelectControl>

        <Portal>
          <SelectPositioner>
            <SelectContent maxH="340px" overflowY="auto">
              {isLoading ? (
                <Text px={4} py={2}>
                  Загрузка объектов...
                </Text>
              ) : collection.items.length ? (
                collection.items.map((item) => (
                  // ✅ ИСПРАВЛЕНО: Ключ и данные берутся из оригинальной структуры (id, title)
                  <SelectItem key={item.id} item={item}>
                    <SelectItemText>{item.title}</SelectItemText>
                    <SelectItemIndicator />
                  </SelectItem>
                ))
              ) : (
                <Text px={4} py={2}>
                  Объекты не найдены
                </Text>
              )}
            </SelectContent>
          </SelectPositioner>
        </Portal>
      </SelectRoot>

      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error.message}
        </Text>
      )}
    </>
  )
}
