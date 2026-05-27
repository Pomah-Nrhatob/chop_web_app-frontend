import z from 'zod'

// Базовая схема для рабочего дня (общая часть для новых и обновляемых записей)
const baseWorkdaySchema = z.object({
  shiftSalary: z.number().min(0, 'Зарплата не может быть отрицательной').optional(),
  isStarted: z.boolean().optional(),
  isStartedComment: z.string().optional(),
  isFinished: z.boolean().optional(),
  isFinishedComment: z.string().optional(),
  workdayStatus: z
    .enum(['MAIN', 'PART_TIME'], {
      errorMap: () => ({ message: 'Статус обязателен' }),
    })
    .optional(),
})

// Схема для существующих записей (с ID)
export const updatedWorkdaySchema = baseWorkdaySchema.extend({
  id: z.number().int().positive('ID записи должен быть положительным числом'),
})

const newWorkdaySchema = baseWorkdaySchema.extend({
  objectWorkdayId: z.number().int().positive('ID рабочего дня объекта должен быть положительным'),
  securityId: z.number().int().positive('Выбор охранника обязателен'),
})

// Основная схема для формы
export const editDaySchema = z.object({
  newWorkdays: z.array(newWorkdaySchema).optional().default([]),
  updatedWorkdays: z.array(updatedWorkdaySchema).optional().default([]),
  deletedWorkdays: z.array(z.number().int().positive()).optional().default([]),
})
