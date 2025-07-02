
'use client';

import { useContext } from 'react';
import { DietPlanContext } from '@/contexts/DietPlanContext';

export const useDietPlans = () => {
  const context = useContext(DietPlanContext);
  if (context === undefined) {
    throw new Error('useDietPlans must be used within a DietPlanProvider');
  }
  return context;
};
