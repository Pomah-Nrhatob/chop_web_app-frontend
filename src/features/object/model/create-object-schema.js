import { z } from 'zod'

export const createObjectSchema = z.object({
  // Обязательные поля
  title: z.string().min(1, 'Название обязательно'),

  // Опциональные поля
  description: z.string().optional(),
})
