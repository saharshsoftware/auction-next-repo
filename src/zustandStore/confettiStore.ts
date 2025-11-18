import { create } from "zustand";
import { ConfettiStore } from "@/interfaces/ConfettiStore";

const CONFETTI_TIMEOUT_MS = 4500;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

const clearHideTimer = (): void => {
  if (!hideTimer) {
    return;
  }
  clearTimeout(hideTimer);
  hideTimer = null;
};

/**
 * Global store that controls the confetti celebration overlay.
 */
export const useConfettiStore = create<ConfettiStore>((set) => ({
  isConfettiVisible: false,
  showConfetti: () => {
    clearHideTimer();
    set({ isConfettiVisible: true });
    hideTimer = setTimeout(() => {
      set({ isConfettiVisible: false });
      hideTimer = null;
    }, CONFETTI_TIMEOUT_MS);
  },
  hideConfetti: () => {
    clearHideTimer();
    set({ isConfettiVisible: false });
  },
}));

