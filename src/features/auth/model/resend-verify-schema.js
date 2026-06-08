import { z } from 'zod'

export const resendVerifySchema = z.object({
  email: z.string().min(1, 'Email обязателен').email('Некорректный формат email'),
})
