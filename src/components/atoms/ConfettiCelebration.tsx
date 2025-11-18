"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useConfettiStore } from "@/zustandStore/confettiStore";

/**
 * Triggers confetti celebration from both left and right sides
 */
const fireConfettiFromBothSides = (): void => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    // Left side confetti
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0, y: 0.5 },
      angle: randomInRange(55, 125),
    });

    // Right side confetti
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 1, y: 0.5 },
      angle: randomInRange(55, 125),
    });
  }, 250);
};

/**
 * Component that listens to confetti store and triggers celebration
 */
const ConfettiCelebration: React.FC = () => {
  const isConfettiVisible = useConfettiStore((state) => state.isConfettiVisible);

  useEffect(() => {
    if (isConfettiVisible) {
      fireConfettiFromBothSides();
    }
  }, [isConfettiVisible]);

  return null;
};

export default ConfettiCelebration;
