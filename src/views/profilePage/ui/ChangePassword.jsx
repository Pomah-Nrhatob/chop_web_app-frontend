'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Field,
  Heading,
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
  IconButton,
} from '@chakra-ui/react'
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema } from '@/features/profile/model/change-password-schema'
import { useChangePassword } from '@/features/profile/api/use-profile'

export default function ChangePassword() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const changePassword = useChangePassword()

  const onSubmit = async (data) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      setIsOpen(false)
      reset()
      setShowPasswords({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      })
    } catch (error) {}
  }

  const handleOpenChange = (details) => {
    setIsOpen(details.open)

    if (!details.open) {
      reset()
      setShowPasswords({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      })
    }
  }

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} boxShadow="md">
      <VStack align="stretch" gap={4} w="100%">
        <HStack gap={2}>
          <FiLock />
          <Heading size="sm">Безопасность</Heading>
        </HStack>

        <Text fontSize="sm" color="gray.600">
          Измените пароль для защиты вашей учетной записи
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogRoot open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button size="sm" variant="surface" mt={2}>
                Изменить пароль
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
                  <DialogTitle>Изменение пароля</DialogTitle>
                </DialogHeader>

                <DialogBody>
                  <VStack spacing={4}>
                    {/* Текущий пароль */}
                    <Box w="full">
                      <Field.Root invalid={!!errors.currentPassword}>
                        <Field.Label fontSize="sm" mb={1}>
                          Текущий пароль
                        </Field.Label>

                        <Box position="relative" w="full">
                          <Input
                            autoFocus
                            {...register('currentPassword')}
                            type={showPasswords.currentPassword ? 'text' : 'password'}
                            placeholder="Введите текущий пароль"
                            pr="40px"
                          />
                          <IconButton
                            position="absolute"
                            right="4px"
                            top="50%"
                            transform="translateY(-50%)"
                            size="xs"
                            variant="ghost"
                            aria-label={
                              showPasswords.currentPassword ? 'Скрыть пароль' : 'Показать пароль'
                            }
                            onClick={() => togglePasswordVisibility('currentPassword')}
                          >
                            {showPasswords.currentPassword ? <FiEyeOff /> : <FiEye />}
                          </IconButton>
                        </Box>

                        <Field.ErrorText>{errors.currentPassword?.message}</Field.ErrorText>
                      </Field.Root>
                    </Box>

                    {/* Новый пароль */}
                    <Box w="full">
                      <Field.Root invalid={!!errors.newPassword}>
                        <Field.Label fontSize="sm" mb={1}>
                          Новый пароль
                        </Field.Label>

                        <Box position="relative" w="full">
                          <Input
                            {...register('newPassword')}
                            type={showPasswords.newPassword ? 'text' : 'password'}
                            placeholder="Введите новый пароль"
                            pr="40px"
                          />
                          <IconButton
                            position="absolute"
                            right="4px"
                            top="50%"
                            transform="translateY(-50%)"
                            size="xs"
                            variant="ghost"
                            aria-label={
                              showPasswords.newPassword ? 'Скрыть пароль' : 'Показать пароль'
                            }
                            onClick={() => togglePasswordVisibility('newPassword')}
                          >
                            {showPasswords.newPassword ? <FiEyeOff /> : <FiEye />}
                          </IconButton>
                        </Box>

                        <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>

                        <Text fontSize="xs" color="gray.500" mt={1}>
                          Минимум 6 символов
                        </Text>
                      </Field.Root>
                    </Box>

                    {/* Подтверждение пароля */}
                    <Box w="full">
                      <Field.Root invalid={!!errors.confirmPassword}>
                        <Field.Label fontSize="sm" mb={1}>
                          Подтвердите новый пароль
                        </Field.Label>

                        <Box position="relative" w="full">
                          <Input
                            {...register('confirmPassword')}
                            type={showPasswords.confirmPassword ? 'text' : 'password'}
                            placeholder="Повторите новый пароль"
                            pr="40px"
                          />
                          <IconButton
                            position="absolute"
                            right="4px"
                            top="50%"
                            transform="translateY(-50%)"
                            size="xs"
                            variant="ghost"
                            aria-label={
                              showPasswords.confirmPassword ? 'Скрыть пароль' : 'Показать пароль'
                            }
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                          >
                            {showPasswords.confirmPassword ? <FiEyeOff /> : <FiEye />}
                          </IconButton>
                        </Box>

                        <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
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
                    loadingText="Изменение..."
                    type="submit"
                    colorScheme="blue"
                  >
                    Изменить пароль
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogPositioner>
          </DialogRoot>
        </form>
      </VStack>
    </Box>
  )
}
