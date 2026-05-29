// store/globalLoaderStore.ts
import { create } from 'zustand'

export const useGlobalLoaderStore = create((set) => ({
  isGlobalLoading: false,
  startGlobalLoading: () => set({ isGlobalLoading: true }),
  stopGlobalLoading: () => set({ isGlobalLoading: false }),
}))
