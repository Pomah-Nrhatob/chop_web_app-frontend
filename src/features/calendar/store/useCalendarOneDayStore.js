import { create } from 'zustand'

const getCurrentYearMonthDay = () => {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  }
}

export const useCalendarOneDayStore = create((set, get) => {
  const { year, month, day } = getCurrentYearMonthDay()

  return {
    queryParams: {
      year,
      month,
      day,
      page: 1,
      limit: 20,
    },

    setQueryParams: (newParams) =>
      set((state) => ({
        queryParams: { ...state.queryParams, ...newParams },
      })),
  }
})
