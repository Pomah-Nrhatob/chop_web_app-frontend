'use client'

import { DateField } from '@/components/ui/DateField'
import { Checkbox, createListCollection, Field, Input, Select, Textarea } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'

export const FormField = ({
  placeholder = '',
  label,
  error,
  register,
  type = 'text',
  options = [],
  control,
  name,
  ...props
}) => {
  if (type === 'date') {
    return (
      <DateField
        control={control}
        name={name}
        label={label}
        error={error}
        placeholder={placeholder}
        {...props}
      />
    )
  }

  const collection = createListCollection({
    items: options,
  })

  return (
    <Field.Root invalid={!!error}>
      {type !== 'checkbox' && <Field.Label>{label}</Field.Label>}

      {type === 'checkbox' ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox.Root
              checked={field.value}
              onCheckedChange={({ checked }) => field.onChange(checked)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>{label}</Checkbox.Label>
            </Checkbox.Root>
          )}
        />
      ) : type === 'select' ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select.Root
              collection={collection}
              value={field.value != null ? [String(field.value)] : []}
              onValueChange={({ value }) => field.onChange(Number(value[0]))}
            >
              <Select.HiddenSelect name={field.name} onBlur={field.onBlur} />

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
          )}
        />
      ) : type === 'textarea' ? (
        <Textarea placeholder={placeholder} {...register} {...props} />
      ) : (
        <Input
          css={{
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            MozAppearance: 'textfield',
          }}
          type={type}
          placeholder={placeholder}
          {...register}
          {...props}
        />
      )}

      <Field.ErrorText>{error?.message}</Field.ErrorText>
    </Field.Root>
  )
}
