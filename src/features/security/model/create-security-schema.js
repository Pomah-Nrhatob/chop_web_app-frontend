import { z } from 'zod'

const preprocessNumber = (val) => {
  if (val === '' || val == null) return null
  if (typeof val === 'number' && Number.isNaN(val)) return null
  return val
}

const preprocessDate = (val) => {
  if (val === '' || val == null) return null

  if (typeof val === 'string' || val instanceof Date) {
    const time = new Date(val).getTime()

    // Некорректная дата — оставляем NaN
    return time
  }

  return val
}

const preprocessPhone = (val) => {
  if (!val) return null

  const digits = String(val).replace(/\D/g, '')

  if (!digits) return null

  return `+${digits}`
}

export const createSecuritySchema = z.object({
  surname: z.string().trim().min(1, 'Фамилия обязательна'),
  name: z.string().trim().min(1, 'Имя обязательно'),

  patronymic: z.string().nullish(),
  phoneNumber: z.preprocess(
    preprocessPhone,
    z
      .string()
      .regex(/^\+7\d{10}$/, 'Введите полный номер телефона')
      .nullish()
  ),

  personality: z.string().nullish(),
  healthStatus: z.string().nullish(),
  chronicDiseases: z.string().nullish(),

  shiftSalary: z.preprocess(preprocessNumber, z.number().min(0).nullish()),

  statusId: z.preprocess(preprocessNumber, z.number().int().nullish()),

  positionId: z.preprocess(preprocessNumber, z.number().int().nullish()),

  birthDate: z.preprocess(
    preprocessDate,
    z
      .number()
      .refine((v) => !Number.isNaN(v), {
        message: 'Введите корректную дату',
      })
      .nullish()
  ),

  hireDate: z.preprocess(
    preprocessDate,
    z
      .number()
      .refine((v) => !Number.isNaN(v), {
        message: 'Введите корректную дату',
      })
      .nullish()
  ),

  dismissalDate: z.preprocess(
    preprocessDate,
    z
      .number()
      .refine((v) => !Number.isNaN(v), {
        message: 'Введите корректную дату',
      })
      .nullish()
  ),

  hasLicense: z.boolean(),
})
