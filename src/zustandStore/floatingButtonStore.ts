import { create } from "zustand";

/**
 * Interface for the FloatingButton store state
 */
interface FloatingButtonState {
  /** Whether the FloatingInterestButton is currently visible */
  isVisible: boolean;
  /** Set the visibility state of the FloatingInterestButton */
  setVisible: (visible: boolean) => void;
}

/**
 * Global store that tracks whether the FloatingInterestButton is visible.
 * Used by BrokerPartnerPrompt to dynamically adjust its position
 * to avoid overlapping with the floating button.
 */
export const useFloatingButtonStore = create<FloatingButtonState>((set) => ({
  isVisible: false,
  setVisible: (visible: boolean) => set({ isVisible: visible }),
}));

