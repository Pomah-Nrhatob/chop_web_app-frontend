import { z } from 'zod'

export const createScheduleSchema = z.object({
  timestamps: z.array(z.string()).min(1, 'Дата должна быть выбрана'),
  securityObjectId: z.number('Выбор объекта обязателен'),
  securities: z.array(z.number()).min(1, 'Охранники должны быть выбраны'),
  workdayStatus: z.enum(['MAIN', 'PART_TIME'], {
    errorMap: () => ({ message: 'Статус обязателен' }),
  }),
})
