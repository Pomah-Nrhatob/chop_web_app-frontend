import { create } from 'zustand'

const getCurrentYearMonth = () => {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

export const useCalendarAllObjectsStore = create((set, get) => {
  const { year, month } = getCurrentYearMonth()

  return {
    queryParams: {
      year,
      month,
      startDay: 1,
      endDay: 5,
      page: 1,
      limit: 20,
    },

    setQueryParams: (newParams) =>
      set((state) => ({
        queryParams: { ...state.queryParams, ...newParams },
      })),

    nextDayRange: () => {
      const state = get()
      const { startDay, month, year } = state.queryParams
      const daysInMonth = new Date(year, month, 0).getDate()
      const nextStart = startDay + 5

      if (nextStart > daysInMonth) return

      const endDay = Math.min(nextStart + 4, daysInMonth)
      set({
        queryParams: {
          ...state.queryParams,
          startDay: nextStart,
          endDay,
        },
      })
    },

    prevDayRange: () => {
      const state = get()
      const { startDay } = state.queryParams
      const prevStart = Math.max(startDay - 5, 1)

      set({
        queryParams: {
          ...state.queryParams,
          startDay: prevStart,
          endDay: Math.min(prevStart + 4, 31),
        },
      })
    },

    getDaysInMonth: () => {
      const { year, month } = get().queryParams
      return new Date(year, month, 0).getDate()
    },

    resetToDefaults: () => {
      const { year, month } = getCurrentYearMonth()
      set({
        queryParams: {
          year,
          month,
          startDay: 1,
          endDay: 5,
        },
      })
    },
  }
})
