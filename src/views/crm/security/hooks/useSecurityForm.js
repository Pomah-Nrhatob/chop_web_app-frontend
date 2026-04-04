import { usePostSecurity } from '@/features/security/api/use-post-security'
import { useUpdateSecurity } from '@/features/security/api/use-update-security'
import { createSecuritySchema } from '@/features/security/model/create-security-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useSecurityForm = (onSuccess, initialData) => {
  const isEditing = !!initialData
  const { mutate: create, isPending: isCreating } = usePostSecurity()
  const { mutate: update, isPending: isUpdating } = useUpdateSecurity()

  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSecuritySchema),

    defaultValues: initialData || {
      hasLicense: false,
      statusId: '',
      surname: '',
      name: '',
      patronymic: '',
      age: undefined,
      shiftSalary: undefined,
      healthStatus: '',
      chronicDiseases: '',
      personality: '',
    },
  })

  const onSubmit = (formData) => {
    const options = {
      onSuccess: () => {
        if (onSuccess) onSuccess()
      },
    }

    if (isEditing) {
      update({ id: initialData.id, data: formData }, options)
    } else {
      create(formData, options)
    }
  }

  return {
    isLoading,
    register,
    handleSubmit,
    errors,
    onSubmit,
    isEditing,
  }
}
