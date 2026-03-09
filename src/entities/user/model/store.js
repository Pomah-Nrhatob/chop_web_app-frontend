import { create } from 'zustand'

export const useUserStore = create((set) => ({
  accessToken: null, // Храним здесь
  isAuth: false,

  setAuth: (token) =>
    set({
      accessToken: token,
      isAuth: true,
    }),

  logout: () =>
    set({
      accessToken: null,
      isAuth: false,
    }),
}))
