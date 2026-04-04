import { Field, Input, Textarea, Flex } from '@chakra-ui/react'

export const FormField = ({
  label,
  error,
  register,
  type = 'text',
  options = [],
  children,
  ...props
}) => {
  const isTextArea = type === 'textarea'
  const isSelect = type === 'select'
  const isCheckbox = type === 'checkbox'

  return (
    <Field.Root invalid={!!error} {...props}>
      {!isCheckbox && <Field.Label>{label}</Field.Label>}

      {isSelect ? (
        <select
          {...register}
          className="chakra-select"
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            width: '100%',
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} hidden={opt.hidden}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : isTextArea ? (
        <Textarea {...register} {...props} />
      ) : isCheckbox ? (
        <Flex align="center" gap={3} p={2} bg="gray.50" borderRadius="md">
          <input
            type="checkbox"
            {...register}
            style={{ width: '20px', height: '20px' }}
            id={props.id}
          />
          <label htmlFor={props.id} style={{ cursor: 'pointer', fontWeight: '500' }}>
            {label}
          </label>
        </Flex>
      ) : (
        <Input {...register} type={type} {...props} />
      )}

      {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
    </Field.Root>
  )
}
