export const WORKDAY_OPTIONS = {
  MAIN: { value: 'MAIN', label: 'Основной день' },
  PART_TIME: { value: 'PART_TIME', label: 'Подработка' },
}

// Маппинг value -> объект для удобства
export const WORKDAY_OPTIONS_MAP = Object.fromEntries(
  Object.values(WORKDAY_OPTIONS).map((item) => [item.value, item])
)
