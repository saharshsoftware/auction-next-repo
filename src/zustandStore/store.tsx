import { create } from "zustand";
import { authStore } from "./authStore";
import { devtools, persist } from "zustand/middleware";
import { AuthStoreType } from "../interfaces/AuthStore";

// change this key according to project name
export const STORE_KEY = "auction-persist-store";
interface StoreState extends AuthStoreType {}

const useGlobalStore = create<StoreState>()(
  persist(
    devtools((...a) => ({
      ...authStore(...a),
      // add more store
    })),
    { name: STORE_KEY }
  )
);

export { useGlobalStore };
