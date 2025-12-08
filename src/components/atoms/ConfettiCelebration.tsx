"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useConfettiStore } from "@/zustandStore/confettiStore";

const CONFETTI_DEFAULTS = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
const CONFETTI_INTERVAL_MS = 250;
const CONFETTI_PARTICLE_COUNT = 25;

/**
 * Generates a random number within a range
 */
const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Fires confetti particles from both left and right sides of the screen
 */
const fireConfettiFromBothSides = (): void => {
  // Left side confetti
  confetti({
    ...CONFETTI_DEFAULTS,
    particleCount: CONFETTI_PARTICLE_COUNT,
    origin: { x: 0, y: 0.5 },
    angle: randomInRange(55, 125),
  });
  // Right side confetti
  confetti({
    ...CONFETTI_DEFAULTS,
    particleCount: CONFETTI_PARTICLE_COUNT,
    origin: { x: 1, y: 0.5 },
    angle: randomInRange(55, 125),
  });
};

/**
 * Component that listens to confetti store and triggers infinite celebration.
 * Confetti runs continuously until isConfettiVisible becomes false.
 */
const ConfettiCelebration: React.FC = () => {
  const isConfettiVisible = useConfettiStore((state) => state.isConfettiVisible);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isConfettiVisible) {
      // Fire immediately on start
      fireConfettiFromBothSides();
      // Continue firing at intervals indefinitely
      intervalRef.current = setInterval(fireConfettiFromBothSides, CONFETTI_INTERVAL_MS);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Clear any remaining confetti particles
      confetti.reset();
    };
  }, [isConfettiVisible]);

  return null;
};

export default ConfettiCelebration;
