import { WORKDAY_OPTIONS } from '@/components/calendar/data/workday-options'
import { useCreateSchedule } from '@/features/calendar/api/use-create-schedule'
import { createScheduleSchema } from '@/features/calendar/model/create-schedule-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useScheduleForm = (initialData, onSuccess = null) => {
  const { mutateAsync: create, isPending: isCreating } = useCreateSchedule()

  const {
    register,
    handleSubmit,
    reset: resetForm,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: initialData || {
      timestamps: [],
      securityObjectId: null,
      securities: [],
      workdayStatus: 'MAIN',
    },
  })

  const onSubmit = async (formData) => {
    const res = await create(formData)

    resetForm()
    onSuccess?.()

    return res
  }

  return {
    isCreating,
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    control,
    watch,
    resetForm,
  }
}
