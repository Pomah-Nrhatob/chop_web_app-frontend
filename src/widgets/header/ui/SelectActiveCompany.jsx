'use client'

import { ConfirmActionDialog } from '@/components/ui/ConfirmActionDialog'
import { useChangeActiveCompany } from '@/features/users/api/use-user'
import { NativeSelect, Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

export function SelectActiveCompany({ companies = [], activeCompany }) {
  const validCompanies = (companies || []).filter((c) => c?.id && typeof c.id === 'string')

  const router = useRouter()

  const initialValue = validCompanies.length > 0 ? activeCompany : null
  const [value, setValue] = useState(activeCompany ?? '')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [isOpenConfirm, setIsOpenConfirm] = useState(false)

  useEffect(() => {
    setValue(activeCompany ?? '')
  }, [activeCompany])

  const { changeActiveCompany, isLoading } = useChangeActiveCompany(() => {
    setIsOpenConfirm(false)
    setSelectedCompany(null)
    router.push('/bc')
  })

  const handleChangeActiveCompany = () => {
    changeActiveCompany({ activeCompanyId: selectedCompany })
  }

  return (
    <Box w={{ base: '150px', md: '250px' }}>
      <Flex align="center" gap={1.5}>
        <NativeSelect.Root size="sm" flex="1">
          <NativeSelect.Field
            onChange={(e) => {
              setSelectedCompany(e.target.value)
              setIsOpenConfirm(true)
            }}
            value={value || ''}
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
            rounded="md"
            _placeholder={{ color: 'fg.muted' }}
            disabled={validCompanies.length === 0}
          >
            <option value="" disabled>
              Выберите компанию
            </option>

            {validCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name || 'Без названия'}
              </option>
            ))}
          </NativeSelect.Field>

          <NativeSelect.Indicator pointerEvents="none">
            <FiChevronDown />
          </NativeSelect.Indicator>
        </NativeSelect.Root>

        <ConfirmActionDialog
          isOpen={isOpenConfirm}
          onClose={() => {
            ;(setIsOpenConfirm(false), setSelectedCompany(null))
          }}
          onConfirm={() => {
            handleChangeActiveCompany()
          }}
          isLoading={isLoading}
          title="Подтвердите смену компании"
          message="Вы точно хотите сменить активную компанию?"
        />
      </Flex>
    </Box>
  )
}
