'use client'

import { Stack, SimpleGrid, Text, Box, Flex } from '@chakra-ui/react'
import { FormField } from '@/components/ui/FormField'
import { Controller } from 'react-hook-form'
import PhoneField from '@/components/ui/PhoneField'
import { useEffect } from 'react'
import SelectSecurityPositions from '@/features/dictionary/components/selectWithSearch/SelectSecurityPosition'
import SelectOneObject from '@/features/dictionary/components/selectWithSearch/SelectOneObject'
import SelectObject from '@/features/dictionary/components/selectWithSearch/SelectObject'

export default function SecurityForm({ onSuccess, initialData, form }) {
  const { isLoading, register, handleSubmit, errors, onSubmit, isEditing, control, watch } = form

  const statusId = watch('statusId')

  return (
    <form id="security-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={6}>
        <Box borderWidth="1px" borderRadius="lg" p={5}>
          <Text fontWeight="bold" color="blue.600" mb={4}>
            Личные данные
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField
              placeholder="Введите фамилию..."
              label="Фамилия *"
              register={register('surname')}
              error={errors.surname}
              disabled={isLoading}
            />

            <FormField
              placeholder="Введите имя..."
              label="Имя *"
              register={register('name')}
              error={errors.name}
              disabled={isLoading}
            />

            <FormField
              placeholder="Введите отчество..."
              label="Отчество"
              register={register('patronymic')}
              disabled={isLoading}
            />

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <PhoneField
                  placeholder="Введите номер телефона..."
                  label="Телефон"
                  field={field}
                  error={fieldState.error}
                  disabled={isLoading}
                />
              )}
            />

            <FormField
              placeholder="Введите/выберите дату"
              type="date"
              name="birthDate"
              control={control}
              label="Дата рождения"
              error={errors.birthDate}
            />
          </SimpleGrid>
        </Box>

        <Box borderWidth="1px" borderRadius="lg" p={5}>
          <Text fontWeight="bold" color="blue.600" mb={4}>
            Служебная информация
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField
              label="Зарплата за смену"
              type="number"
              placeholder="Введите зарплату..."
              register={register('shiftSalary', {
                valueAsNumber: true,
              })}
              error={errors.shiftSalary}
              disabled={isLoading}
            />

            <FormField
              placeholder="Выберите статус"
              control={control}
              name="statusId"
              label="Статус"
              type="select"
              error={errors.statusId}
              disabled={isLoading}
              options={[
                {
                  label: 'Активен',
                  value: '1',
                },
                {
                  label: 'Уволен',
                  value: '3',
                },
              ]}
            />

            <FormField
              placeholder="Введите/выберите дату"
              label="Дата приема"
              type="date"
              name="hireDate"
              control={control}
              error={errors.hireDate}
            />

            {statusId === 3 && (
              <FormField
                placeholder="Введите/выберите дату"
                type="date"
                name="dismissalDate"
                control={control}
                label="Дата увольнения"
                error={errors.dismissalDate}
              />
            )}
          </SimpleGrid>

          <Flex mt={4} gap={5} flexDirection="column">
            <Controller
              name="positionId"
              control={control}
              render={({ field }) => (
                <SelectSecurityPositions
                  value={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="objectId"
              control={control}
              render={({ field }) => {
                return (
                  <SelectObject
                    helpText="Выберите объект, к которому будет привязан сотрудник"
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                    disabled={isLoading}
                  />
                )
              }}
            />

            <FormField
              label="Есть действующая лицензия/разрешение"
              type="checkbox"
              id="license"
              register={register('hasLicense')}
              disabled={isLoading}
              control={control}
              name="hasLicense"
            />
          </Flex>
        </Box>

        <Box borderWidth="1px" borderRadius="lg" p={5}>
          <Text fontWeight="bold" color="blue.600" mb={4}>
            Дополнительная информация
          </Text>

          <Stack gap={4}>
            <FormField
              placeholder="Введите тест..."
              label="Состояние здоровья"
              register={register('healthStatus')}
              disabled={isLoading}
            />

            <FormField
              placeholder="Введите тест..."
              label="Хронические заболевания"
              register={register('chronicDiseases')}
              disabled={isLoading}
            />

            <FormField
              placeholder="Введите тест..."
              label="Характеристика"
              type="textarea"
              rows={5}
              register={register('personality')}
              disabled={isLoading}
            />
          </Stack>
        </Box>
      </Stack>
    </form>
  )
}
