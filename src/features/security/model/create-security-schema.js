import { z } from 'zod'

const preprocessNumber = (val) => {
  // 1. Если поле пустое (строка) — возвращаем undefined
  if (val === '') return undefined
  // 2. Если React Hook Form прислал NaN (из-за valueAsNumber) — возвращаем undefined
  if (typeof val === 'number' && isNaN(val)) return undefined
  // 3. В остальных случаях оставляем как есть для дальнейшей валидации
  return val
}

export const createSecuritySchema = z.object({
  surname: z.string().min(1, 'Фамилия обязательна'),
  name: z.string().min(1, 'Имя обязательно'),

  patronymic: z.string().optional(),
  personality: z.string().optional(),
  healthStatus: z.string().optional(),
  chronicDiseases: z.string().optional(),

  age: z.preprocess(
    preprocessNumber,
    z.coerce.number().int().min(0, 'Минимум 0 лет').max(100).optional()
  ),

  shiftSalary: z.preprocess(
    preprocessNumber,
    z.coerce.number().min(0, 'Зарплата не может быть отрицательной').optional()
  ),

  statusId: z.preprocess(preprocessNumber, z.coerce.number().int().optional()),

  hasLicense: z.boolean().default(false),
})
