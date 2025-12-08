import { create } from "zustand";
import { ConfettiStore } from "@/interfaces/ConfettiStore";

/**
 * Global store that controls the confetti celebration overlay.
 * Confetti runs infinitely until manually hidden via hideConfetti().
 */
export const useConfettiStore = create<ConfettiStore>((set) => ({
  isConfettiVisible: false,
  showConfetti: () => {
    set({ isConfettiVisible: true });
  },
  hideConfetti: () => {
    set({ isConfettiVisible: false });
  },
}));
