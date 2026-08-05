import { describe, it, expect } from 'vitest'

describe('Базовая проверка окружения Vitest', () => {
  it('должен успешно выполнять простые математические проверки', () => {
    expect(1 + 1).toBe(2)
  })

  it('должен иметь доступ к глобальным объектам браузера через jsdom', () => {
    expect(globalThis.window).toBeDefined()
    expect(document).toBeDefined()
  })
})
