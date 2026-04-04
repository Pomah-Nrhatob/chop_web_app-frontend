import { usePostObject } from '@/features/object/api/use-post-object'
import { useUpdateObject } from '@/features/object/api/use-update-object'
import { createObjectSchema } from '@/features/object/model/create-object-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useObjectForm = (onSuccess, initialData) => {
  const isEditing = !!initialData
  const { mutate: create, isPending: isCreating } = usePostObject()
  const { mutate: update, isPending: isUpdating } = useUpdateObject()

  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createObjectSchema),

    defaultValues: initialData || {
      title: '',
      description: '',
    },
  })

  const onSubmit = (formData) => {
    const options = {
      onSuccess: () => {
        resetForm()
        if (onSuccess) onSuccess()
      },
    }

    if (isEditing) {
      update({ id: initialData.id, data: formData }, options)
    } else {
      create(formData, options)
    }
  }
  return { isLoading, register, handleSubmit, errors, onSubmit, isEditing }
}
