import { z } from 'zod'

export const createSecuritySchema = z.object({
  // Обязательные поля
  name: z.string().min(1, 'Имя обязательно'),
  surname: z.string().min(1, 'Фамилия обязательна'),

  // Опциональные поля
  age: z.number().int().positive().optional(),

  patronymic: z.string().optional(),

  hasLicense: z.boolean().optional(),

  personality: z.string().optional(),

  healthStatus: z.string().optional(),

  chronicDiseases: z.string().optional(),

  shiftSalary: z.number().int().min(0, 'Зарплата не может быть отрицательной').optional(),

  statusId: z.number().int().optional(),
})
