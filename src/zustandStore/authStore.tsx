import { create } from "zustand";
import { AuthStoreType } from "../interfaces/AuthStore";
import { devtools } from "zustand/middleware";

export const useAuthStore = create<AuthStoreType>()(
  devtools((set) => ({
    isNewUser: false,
    setNewUserStatus: (status: boolean) => set({ isNewUser: status }),
    authRefreshTrigger: 0,
    triggerAuthRefresh: () => set((state) => ({ authRefreshTrigger: state.authRefreshTrigger + 1 })),
  }))
);