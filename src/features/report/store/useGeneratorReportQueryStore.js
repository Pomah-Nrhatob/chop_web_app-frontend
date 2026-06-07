import { create } from 'zustand'

const getCurrentYearMonth = () => {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

export const useGeneratorReportQueryStore = create((set, get) => {
  const { year, month } = getCurrentYearMonth()

  return {
    queryParams: {
      periodType: 'month',
      itemId: null,
      year,
      month,
      startDay: null,
      endDay: null,
    },

    setQueryParams: (newParams) =>
      set((state) => ({
        queryParams: { ...state.queryParams, ...newParams },
      })),

    getDaysInMonth: () => {
      const { year, month } = get().queryParams
      return new Date(year, month, 0).getDate()
    },

    resetToDefaults: () => {
      const { year, month } = getCurrentYearMonth()
      set({
        queryParams: {
          itemId: null,
          periodType: 'month',
          year,
          month,
          startDay: null,
          endDay: null,
        },
      })
    },
  }
})
