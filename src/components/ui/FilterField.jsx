import { Field, Input } from '@chakra-ui/react'

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

  return (
    <Field.Root {...props}>
      <Field.Label fontSize="xs">{label}</Field.Label>
      {isSelect ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            width: '100%',
            fontSize: '14px',
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} hidden={opt.hidden}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          bg="white"
        />
      )}
    </Field.Root>
  )
}
