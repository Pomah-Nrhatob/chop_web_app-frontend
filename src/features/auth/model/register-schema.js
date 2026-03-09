import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(50, 'Имя слишком длинное'),

  surname: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия слишком длинная'),

  email: z.string().min(1, 'Email обязателен').email('Некорректный формат email'),

  password: z
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .regex(/[A-Za-z0-9_-]+/, 'Пароль может содержать только A-Z, a-z, 0-9, _ и -'),
})
