'use client'

import { Field, Input } from '@chakra-ui/react'
import { PatternFormat } from 'react-number-format'

export default function PhoneField({ label, error, field, disabled, placeholder = '' }) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>

      <PatternFormat
        customInput={Input}
        format="+7 (###) ###-##-##"
        value={field.value?.replace(/^\+?7/, '')} // убираем +7 перед отображением
        placeholder={placeholder}
        onValueChange={({ value }) => {
          if (!value) {
            field.onChange('')
            return
          }

          field.onChange(`+7${value}`)
        }}
      />

      <Field.ErrorText>{error?.message}</Field.ErrorText>
    </Field.Root>
  )
}
