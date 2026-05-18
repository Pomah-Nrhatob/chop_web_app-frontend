import { WORKDAY_OPTIONS } from '@/components/calendar/data/workday-options'
import { createListCollection, Select, Text } from '@chakra-ui/react'
import React from 'react'
import { Controller } from 'react-hook-form'

export default function SelectTypeDay({ control }) {
  const collection = createListCollection({
    items: Object.values(WORKDAY_OPTIONS),
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })

  return (
    <Controller
      control={control}
      name="workdayStatus"
      rules={{ required: 'Тип дня обязателен' }}
      render={({ field, fieldState }) => {
        return (
          <div>
            <Text fontWeight="medium" mb={2}>
              Тип дня
              {!field.value && (
                <Text as="span" color="red.500" ml={1}>
                  *
                </Text>
              )}
            </Text>

            <Select.Root
              collection={collection}
              value={field.value ? [field.value] : []}
              onValueChange={(details) => {
                field.onChange(details.value[0])
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
            {fieldState.error && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {fieldState.error.message}
              </Text>
            )}
          </div>
        )
      }}
    />
  )
}
