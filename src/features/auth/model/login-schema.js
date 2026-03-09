import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email обязателен').email('Некорректный формат email'),
  password: z.string().min(1, 'Пароль обязателен'),
})
