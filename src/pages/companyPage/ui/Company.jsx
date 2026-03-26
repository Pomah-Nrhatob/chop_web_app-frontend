'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
  Input,
  useToast,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  useDisclosure,
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
} from '@chakra-ui/react'

// 🎨 React Icons
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiChevronRight,
  FiBuilding,
  FiUsers,
  FiAlertTriangle,
} from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCompanySchema } from '@/features/company/model/create-company-schema'
import { useCreateCompany } from '@/features/company/api/use-company'
import { toaster } from '@/providers/chakraProvider/toaster'

export default function Company() {
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createCompanySchema),
    defaultValues: '',
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

  return (
    <Container maxW="container.lg" pt={10} pb={20}>
      <VStack spacing={6} align="stretch">
        {/* Заголовок страницы */}
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={1}>
              Мои компании
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Управление доступом и ролями в организациях
            </Text>
          </Box>
          {/* Модалка создания компании */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogRoot open={isOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button colorScheme="blue" leftIcon={<FiPlus />}>
                  Создать компанию
                </Button>
              </DialogTrigger>
              <DialogBackdrop />
              <DialogPositioner>
                <DialogContent>
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
        </HStack>
      </VStack>
    </Container>
  )
}
