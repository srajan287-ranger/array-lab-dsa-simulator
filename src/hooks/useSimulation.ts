import { useState, useCallback, useRef, useEffect } from 'react';
import type { SimStep } from '@/types';

export interface SimulationController {
  steps: SimStep[];
  currentStep: number;
  isPlaying: boolean;
  start: () => void;
  next: () => void;
  prev: () => void;
  pause: () => void;
  play: () => void;
  reset: () => void;
  goTo: (step: number) => void;
  setSpeed: (speed: number) => void;
  speed: number;
  isReady: boolean;
}

export function useSimulation(generateSteps: () => SimStep[]): SimulationController {
  const [steps, setSteps] = useState<SimStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const generateRef = useRef(generateSteps);

  useEffect(() => {
    generateRef.current = generateSteps;
  });

  const start = useCallback(() => {
    const generated = generateRef.current();
    setSteps(generated);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentStep((p) => Math.max(p - 1, 0));
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);

  const play = useCallback(() => {
    if (steps.length === 0) {
      const generated = generateRef.current();
      setSteps(generated);
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [steps.length]);

  const reset = useCallback(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const goTo = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, steps.length - 1)));
  }, [steps.length]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  return {
    steps,
    currentStep,
    isPlaying,
    start,
    next,
    prev,
    pause,
    play,
    reset,
    goTo,
    setSpeed,
    speed,
    isReady: steps.length > 0,
  };
}
