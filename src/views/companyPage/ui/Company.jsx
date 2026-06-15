'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Spinner,
  DialogRoot,
  DialogTrigger,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  Field,
  Flex,
  Badge,
  IconButton,
  Popover,
} from '@chakra-ui/react'

import { FiPlus, FiHelpCircle } from 'react-icons/fi'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCompanySchema } from '@/features/company/model/create-company-schema'
import { useCompanies, useCreateCompany, useOneCompany } from '@/features/company/api/use-company'
import { toaster } from '@/providers/chakraProvider/toaster'
import { useUser } from '@/features/users/api/use-user'
import CompanyDetails from '@/views/companyPage/ui/CompanyDetails'
import UserCompaniesList from '@/views/companyPage/ui/UserCompaniesList'
import ContainerForPage from '@/components/containerForPage/ContainerForPage'

const rolesInfo = [
  {
    role: 'ADMIN',
    colorScheme: 'purple',
    text: 'полный доступ',
    title: 'Администратор',
    description:
      'Полный доступ к компании: управление настройками, участниками, ролями, объектами, сотрудниками, сменами и удалением компании.',
  },
  {
    role: 'MANAGER',
    colorScheme: 'blue',
    text: 'ресурсы и смены',
    title: 'Менеджер',
    description:
      'Управляет рабочими ресурсами компании: сотрудниками, объектами и сменами. Не может удалять компанию и ограничен в управлении участниками.',
  },
  {
    role: 'USER',
    colorScheme: 'gray',
    text: 'просмотр и отчёты',
    title: 'Пользователь',
    description:
      'Имеет доступ только к просмотру данных компании и выгрузке отчётов без возможности изменять ресурсы и настройки.',
  },
]

export default function Company() {
  const [isOpen, setIsOpen] = useState(false)

  const { companies = [], isLoading: isLoadingCompanies } = useCompanies()

  const {
    activeCompanyInfo,
    isLoading: isLoadingCompany,
    isFetching: isFetchingCompany,
  } = useOneCompany()

  const { user } = useUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: '',
    },
  })

  const createCompany = useCreateCompany()

  const onSubmit = async (data) => {
    try {
      await createCompany.mutateAsync(data)

      toaster.create({
        title: 'Компания создана',
        description: `"${data.name}" успешно добавлена`,
        type: 'success',
        duration: 3000,
      })

      setIsOpen(false)
      reset()
    } catch (error) {
      toaster.create({
        title: 'Ошибка создания',
        description: error.response?.data?.message || 'Попробуйте позже',
        type: 'error',
        duration: 3000,
      })
    }
  }

  const handleOpenChange = (details) => {
    setIsOpen(details.open)

    if (!details.open) {
      reset()
    }
  }

  const isPageLoading = isLoadingCompanies || isLoadingCompany || isFetchingCompany

  return (
    <ContainerForPage
      title="Мои компании"
      text="Управление доступом и ролями в организациях"
      actionComponent={
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogRoot open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button size={{ base: 'xs', md: 'sm' }}>
                <FiPlus /> Создать компанию
              </Button>
            </DialogTrigger>

            <DialogBackdrop />

            <DialogPositioner
              display="flex"
              alignItems={{ base: 'center', md: 'flex-start' }}
              justifyContent="center"
            >
              <DialogContent w={{ base: 'calc(100vw - 24px)', md: '100%' }} py={2} px={2}>
                <DialogCloseTrigger />

                <DialogHeader>
                  <DialogTitle>Создать компанию</DialogTitle>
                </DialogHeader>

                <DialogBody>
                  <VStack spacing={4}>
                    <Box w="full">
                      <Field.Root invalid={!!errors.name}>
                        <Field.Label fontSize="sm" mb={1}>
                          Название компании
                        </Field.Label>

                        <Input
                          autoFocus
                          {...register('name')}
                          type="text"
                          placeholder="ООО Название"
                        />

                        <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                      </Field.Root>
                    </Box>
                  </VStack>
                </DialogBody>

                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button disabled={isSubmitting} variant="ghost">
                      Отмена
                    </Button>
                  </DialogActionTrigger>

                  <Button
                    isLoading={isSubmitting}
                    loadingText="Создание..."
                    type="submit"
                    colorScheme="blue"
                  >
                    Создать
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogPositioner>
          </DialogRoot>
        </form>
      }
    >
      {isPageLoading ? (
        <Flex minH="260px" align="center" justify="center">
          <Spinner size="lg" color="blue.500" thickness="3px" />
        </Flex>
      ) : (
        <Flex flexDirection="column" gap={5}>
          <Box
            px={{ base: 3, md: 4 }}
            py={{ base: 3, md: 3 }}
            bg="gray.50"
            borderWidth="1px"
            borderColor="gray.100"
            borderRadius="lg"
          >
            <Flex
              gap={{ base: 2, md: 4 }}
              align={{ base: 'stretch', md: 'center' }}
              direction={{ base: 'column', md: 'row' }}
              flexWrap="wrap"
            >
              <Text fontSize="sm" fontWeight="medium" color="gray.700" flexShrink={0}>
                Роли:
              </Text>

              <Flex
                gap={{ base: 2, md: 4 }}
                direction={{ base: 'column', sm: 'row' }}
                flexWrap="wrap"
              >
                {rolesInfo.map((item) => (
                  <HStack
                    key={item.role}
                    gap={2}
                    justify={{ base: 'space-between', sm: 'flex-start' }}
                    align="center"
                  >
                    <HStack gap={2}>
                      <Badge colorScheme={item.colorScheme} variant="subtle">
                        {item.role}
                      </Badge>

                      <Text fontSize="sm" color="gray.600">
                        {item.text}
                      </Text>
                    </HStack>

                    <Popover.Root positioning={{ placement: 'top' }}>
                      <Popover.Trigger asChild>
                        <IconButton
                          aria-label={`Описание роли ${item.role}`}
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                        >
                          <FiHelpCircle />
                        </IconButton>
                      </Popover.Trigger>

                      <Popover.Positioner>
                        <Popover.Content maxW="280px">
                          <Popover.Arrow />
                          <Popover.Body p={3}>
                            <VStack align="stretch" gap={2}>
                              <HStack gap={2}>
                                <Badge colorScheme={item.colorScheme} variant="subtle">
                                  {item.role}
                                </Badge>

                                <Text fontSize="sm" fontWeight="semibold">
                                  {item.title}
                                </Text>
                              </HStack>

                              <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                                {item.description}
                              </Text>
                            </VStack>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover.Positioner>
                    </Popover.Root>
                  </HStack>
                ))}
              </Flex>
            </Flex>
          </Box>

          {companies?.length > 0 ? (
            <CompanyDetails companyData={activeCompanyInfo} currentUserId={user?.id} />
          ) : null}

          <UserCompaniesList
            activeCompanyId={user?.activeCompanyId}
            companies={companies}
            currentUserId={user?.id}
          />
        </Flex>
      )}
    </ContainerForPage>
  )
}
