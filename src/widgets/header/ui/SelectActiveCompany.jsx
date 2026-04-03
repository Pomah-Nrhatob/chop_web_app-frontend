'use client'

import { useChangeActiveCompany } from '@/features/users/api/use-user'
import { NativeSelect, Box, Flex, Text, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FiChevronDown, FiCheck, FiCheckCircle } from 'react-icons/fi'

export function SelectActiveCompany({ companies = [], activeCompany }) {
  const validCompanies = (companies || []).filter((c) => c?.id && typeof c.id === 'string')

  const initialValue = validCompanies.length > 0 ? activeCompany : null
  const [value, setValue] = useState(initialValue)
  const [isChange, setIsChange] = useState(false)

  useEffect(() => {
    setValue(activeCompany)
  }, [activeCompany])

  useEffect(() => {
    if (value !== activeCompany) {
      setIsChange(true)
      return
    }
    setIsChange(false)
  }, [value])

  const { changeActiveCompany, isLoading } = useChangeActiveCompany(() => {
    setIsChange(false)
  })

  const handleChangeActiveCompany = () => {
    changeActiveCompany({ activeCompanyId: value })
  }

  return (
    <Box w={{ base: '150px', md: '250px' }}>
      <Flex align="center" gap={1.5}>
        <NativeSelect.Root size="sm" flex="1">
          <NativeSelect.Field
            onChange={(e) => setValue(e.target.value)}
            value={value || ''}
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
            rounded="md"
            _placeholder={{ color: 'fg.muted' }}
            disabled={validCompanies.length === 0}
          >
            {validCompanies.length > 0 ? (
              validCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name || 'Без названия'}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Создайте компанию
              </option>
            )}
          </NativeSelect.Field>

          <NativeSelect.Indicator pointerEvents="none">
            <FiChevronDown />
          </NativeSelect.Indicator>
        </NativeSelect.Root>

        <Button
          loading={isLoading}
          size="xs"
          variant="ghost"
          onClick={handleChangeActiveCompany}
          disabled={!isChange || !value}
          color={isChange ? 'green.500' : 'gray.300'}
          p={0}
          minW="auto"
        >
          {isChange ? <FiCheck /> : <FiCheckCircle />}
        </Button>
      </Flex>
    </Box>
  )
}
