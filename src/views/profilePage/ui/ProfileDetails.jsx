import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Avatar,
  Input,
  Field,
} from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { FiEdit2, FiCheck, FiX, FiUser } from 'react-icons/fi'
import { FaBuilding } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfileSchema } from '@/features/profile/model/update-profile-schema'
import { useUpdateProfile } from '@/features/profile/api/use-profile'
import { Tooltip } from '@/components/ui/tooltip'

const ProfileDetails = ({ profileData }) => {
  const {
    name,
    surname,
    email,
    companies = [],
    companyUsers = [],
    activeCompanyId,
  } = profileData || {}

  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingSurname, setIsEditingSurname] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: name || '',
      surname: surname || '',
    },
  })

  useEffect(() => {
    setValue('name', name || '')
    setValue('surname', surname || '')
  }, [name, surname, setValue])

  const { mutate: updateProfile, isPending: isPendingUpdate } = useUpdateProfile()

  const onSubmit = (data) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditingName(false)
        setIsEditingSurname(false)
      },
    })
  }

  const isEditing = isEditingName || isEditingSurname

  const activeCompanyInfo = useMemo(() => {
    if (!activeCompanyId || companies.length === 0) return null

    const company = companies.find((c) => c.id === activeCompanyId)
    const companyUser = companyUsers.find((cu) => cu.companyId === activeCompanyId)

    if (!company || !companyUser) return null

    return {
      name: company.name,
      createdAt: company.createdAt,
      role: companyUser.role,
    }
  }, [activeCompanyId, companies, companyUsers])

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} boxShadow="md">
      <VStack align="stretch" w="100%" gap={5}>
        <HStack justify="space-between" w="100%">
          <HStack gap={3}>
            <Avatar.Root size="lg">
              <Avatar.Fallback>
                <FiUser />
              </Avatar.Fallback>
            </Avatar.Root>
            <Box>
              <Heading size="md">
                {name} {surname}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {email}
              </Text>
            </Box>
          </HStack>
        </HStack>

        <Box width="100%" borderBottomWidth="1px" borderBottomColor="gray.200" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack align="stretch" gap={4} w="100%">
            <Heading size="sm">Личная информация</Heading>

            {/* Имя */}
            <HStack justify="space-between" w="100%" align="center">
              <Text fontSize="sm" fontWeight="medium" color="gray.700" minW="100px">
                Имя:
              </Text>

              {isEditingName ? (
                <HStack flex="1" gap={2}>
                  <Box flex="1">
                    <Field.Root invalid={!!errors.name}>
                      <Input size="sm" {...register('name')} placeholder="Введите имя" autoFocus />
                      <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                    </Field.Root>
                  </Box>

                  <HStack gap={1}>
                    <Tooltip content="Сохранить">
                      <IconButton
                        aria-label="Сохранить имя"
                        size="xs"
                        colorPalette="green"
                        variant="ghost"
                        type="submit"
                        loading={isPendingUpdate}
                      >
                        <FiCheck />
                      </IconButton>
                    </Tooltip>

                    <Tooltip content="Отменить">
                      <IconButton
                        aria-label="Отменить редактирование"
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          setValue('name', name || '')
                          setIsEditingName(false)
                        }}
                      >
                        <FiX />
                      </IconButton>
                    </Tooltip>
                  </HStack>
                </HStack>
              ) : (
                <HStack flex="1" justify="space-between">
                  <Text fontSize="md">{name || 'Не указано'}</Text>
                  <Tooltip content="Редактировать имя">
                    <IconButton
                      aria-label="Редактировать имя"
                      size="xs"
                      variant="ghost"
                      onClick={() => setIsEditingName(true)}
                      disabled={isEditing}
                    >
                      <FiEdit2 />
                    </IconButton>
                  </Tooltip>
                </HStack>
              )}
            </HStack>

            {/* Фамилия */}
            <HStack justify="space-between" w="100%" align="center">
              <Text fontSize="sm" fontWeight="medium" color="gray.700" minW="100px">
                Фамилия:
              </Text>

              {isEditingSurname ? (
                <HStack flex="1" gap={2}>
                  <Box flex="1">
                    <Field.Root invalid={!!errors.surname}>
                      <Input
                        size="sm"
                        {...register('surname')}
                        placeholder="Введите фамилию"
                        autoFocus
                      />
                      <Field.ErrorText>{errors.surname?.message}</Field.ErrorText>
                    </Field.Root>
                  </Box>

                  <HStack gap={1}>
                    <Tooltip content="Сохранить">
                      <IconButton
                        aria-label="Сохранить фамилию"
                        size="xs"
                        colorPalette="green"
                        variant="ghost"
                        type="submit"
                        loading={isPendingUpdate}
                      >
                        <FiCheck />
                      </IconButton>
                    </Tooltip>

                    <Tooltip content="Отменить">
                      <IconButton
                        aria-label="Отменить редактирование"
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          setValue('surname', surname || '')
                          setIsEditingSurname(false)
                        }}
                      >
                        <FiX />
                      </IconButton>
                    </Tooltip>
                  </HStack>
                </HStack>
              ) : (
                <HStack flex="1" justify="space-between">
                  <Text fontSize="md">{surname || 'Не указано'}</Text>
                  <Tooltip content="Редактировать фамилию">
                    <IconButton
                      aria-label="Редактировать фамилию"
                      size="xs"
                      variant="ghost"
                      onClick={() => setIsEditingSurname(true)}
                      disabled={isEditing}
                    >
                      <FiEdit2 />
                    </IconButton>
                  </Tooltip>
                </HStack>
              )}
            </HStack>

            {/* Email - только просмотр */}
            <HStack justify="space-between" w="100%" align="center">
              <Text fontSize="sm" fontWeight="medium" color="gray.700" minW="100px">
                Email:
              </Text>
              <HStack flex="1" justify="space-between">
                <Text fontSize="md" color="gray.600">
                  {email || 'Не указано'}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </form>

        <Box width="100%" borderBottomWidth="1px" borderBottomColor="gray.200" />

        {/* Информация о доступе */}
        <VStack align="stretch" gap={3} w="100%">
          <HStack gap={2}>
            <FaBuilding />
            <Heading size="sm">Текущая компания</Heading>
          </HStack>

          {activeCompanyInfo ? (
            <HStack justify="space-between" w="100%">
              <Box>
                <Text fontWeight="medium">{activeCompanyInfo.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  Создана: {new Date(activeCompanyInfo.createdAt).toLocaleDateString()}
                </Text>
              </Box>
              <Badge
                colorScheme={activeCompanyInfo.role === 'ADMIN' ? 'purple' : 'gray'}
                variant="subtle"
              >
                {activeCompanyInfo.role}
              </Badge>
            </HStack>
          ) : (
            <Text color="gray.500">Нет активной компании</Text>
          )}
        </VStack>
      </VStack>
    </Box>
  )
}

export default ProfileDetails
