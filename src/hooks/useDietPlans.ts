
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DietPlan, DietCategory } from '@/types';
import { mockDietPlans, mockDietCategories } from '@/lib/mock-data';

interface UseDietPlansResult {
  dietPlans: DietPlan[];
  categories: DietCategory[];
  loading: boolean;
  addDietPlan: (planData: Omit<DietPlan, 'id' | 'imageUrl'>) => Promise<void>;
  getDietPlanById: (id: string) => DietPlan | undefined;
}

export function useDietPlans(): UseDietPlansResult {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(mockDietPlans);
  const [categories, setCategories] = useState<DietCategory[]>(mockDietCategories);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading, ensures client-side state is hydrated
    setLoading(false);
  }, []);

  const addDietPlan = useCallback(async (planData: Omit<DietPlan, 'id' | 'imageUrl'>) => {
    const newPlan: DietPlan = {
      ...planData,
      id: `diet${Date.now()}`,
      imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(planData.name)}`,
    };
    setDietPlans(prevPlans => [newPlan, ...prevPlans]);
  }, []);

  const getDietPlanById = useCallback((id: string): DietPlan | undefined => {
    return dietPlans.find(plan => plan.id === id);
  }, [dietPlans]);

  return {
    dietPlans,
    categories,
    loading,
    addDietPlan,
    getDietPlanById,
  };
}
