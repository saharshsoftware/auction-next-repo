import { StateCreator } from "zustand";
import { AuthStoreType } from "../interfaces/AuthStore";

export const authStore: StateCreator<AuthStoreType> = (set) => ({
  isAuthenticated: false,
  token: "",
  userData: {
    user: null,
  },
  setToken: (payload: string) =>
    set(() => ({ token: payload, isAuthenticated: !!payload })),
  setUser: (payload: any) => set(() => ({ userData: payload })),
  resetAuthStore: () => set(() => ({ token: "", userData: {} })),
});
