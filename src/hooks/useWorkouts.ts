'use client';

import { useContext } from 'react';
import { WorkoutContext } from '@/contexts/WorkoutContext';

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};
