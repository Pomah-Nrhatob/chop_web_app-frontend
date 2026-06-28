import { createListCollection, Field, Input, Select } from '@chakra-ui/react'

export const FilterField = ({
  label,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  ...props
}) => {
  const isSelect = type === 'select'

  const collection = createListCollection({
    items: options,
  })

  return (
    <Field.Root {...props}>
      <Field.Label fontSize="xs">{label}</Field.Label>

      {isSelect ? (
        <Select.Root
          bg="white"
          collection={collection}
          value={value != null && value !== '' ? [String(value)] : []}
          onValueChange={({ value }) => onChange(value[0] ?? '')}
          placeholder={placeholder}
        >
          <Select.HiddenSelect />

          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={placeholder} />
            </Select.Trigger>

            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>

          <Select.Positioner>
            <Select.Content>
              {collection.items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      ) : (
        <Input
          type={type}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          bg="white"
        />
      )}
    </Field.Root>
  )
}
