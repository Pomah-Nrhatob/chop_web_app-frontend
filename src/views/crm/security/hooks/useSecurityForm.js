import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { usePostSecurity } from '@/features/security/api/use-post-security'
import { useUpdateSecurity } from '@/features/security/api/use-update-security'
import {
  createSecuritySchema,
  CreateSecurityForm,
} from '@/features/security/model/create-security-schema'

const defaultValues = {
  surname: '',
  name: '',
  patronymic: '',

  phoneNumber: '',

  // age: undefined,

  birthDate: undefined,
  hireDate: undefined,
  dismissalDate: undefined,

  hasLicense: false,

  personality: '',
  healthStatus: '',
  chronicDiseases: '',

  shiftSalary: undefined,
  statusId: 1,
  positionId: undefined,
}

export const useSecurityForm = (onSuccess, initialData) => {
  const isEditing = Boolean(initialData)

  const { mutate: create, isPending: isCreating } = usePostSecurity()
  const { mutate: update, isPending: isUpdating } = useUpdateSecurity()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(createSecuritySchema),
    defaultValues,
  })

  useEffect(() => {
    if (initialData) {
      reset({
        ...defaultValues,
        ...initialData,
      })
    } else {
      reset(defaultValues)
    }
  }, [initialData, reset])

  const statusId = watch('statusId')

  useEffect(() => {
    if (statusId !== 3) {
      setValue('dismissalDate', null)
    }
  }, [statusId, setValue])

  const onSubmit = (data) => {
    const options = {
      onSuccess,
    }

    if (isEditing) {
      update(
        {
          id: initialData.id,
          data,
        },
        options
      )
    } else {
      create(data, options)
    }
  }

  return {
    control,
    register,
    handleSubmit,
    errors,
    onSubmit,
    watch,
    resetForm: () => reset(defaultValues),
    isLoading: isCreating || isUpdating,
    isEditing,
  }
}
