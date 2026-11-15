import * as React from 'react';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';

export function useStudyTracker(isActive = true) {
  const addStudySeconds = useGamificationStore((s) => s.addStudySeconds);

  React.useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      addStudySeconds(5);
    }, 5000);

    return () => clearInterval(interval);
  }, [isActive, addStudySeconds]);
}
