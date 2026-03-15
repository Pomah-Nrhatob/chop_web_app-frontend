import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email обязателен').email('Некорректный формат email'),

  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'), // Добавили проверку длины
})
