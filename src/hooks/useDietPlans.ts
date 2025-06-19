
'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import type { DietPlan, DietCategory } from '@/types';
import { mockDietPlans, mockDietCategories } from '@/lib/mock-data'; // Assuming you'll create these

interface UseDietPlansResult {
  dietPlans: DietPlan[];
  categories: DietCategory[];
  loading: boolean;
  addDietPlan: (planData: Omit<DietPlan, 'id' | 'imageUrl'>) => void;
  getDietPlanById: (id: string) => DietPlan | undefined;
  // Add other diet plan specific functions if needed, e.g., toggleFavoriteDietPlan
}


// This context part is if we decide to make a DietPlanProvider, similar to WorkoutProvider
// For now, the hook itself can manage state or we can integrate into a global AppProvider later.
// Let's make this hook self-contained with local storage for now.

export function useDietPlans(): UseDietPlansResult {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [categories] = useState<DietCategory[]>(mockDietCategories); // Using mock categories directly
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load diet plans from local storage
    const storedDietPlans = localStorage.getItem('fitdeedDietPlans');
    if (storedDietPlans) {
      setDietPlans(JSON.parse(storedDietPlans));
    } else {
      // Initialize with mock data if nothing in local storage
      setDietPlans(mockDietPlans);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save diet plans to local storage whenever they change, if not loading
    if (!loading) {
      localStorage.setItem('fitdeedDietPlans', JSON.stringify(dietPlans));
    }
  }, [dietPlans, loading]);

  const addDietPlan = useCallback((planData: Omit<DietPlan, 'id' | 'imageUrl'>) => {
    const newPlan: DietPlan = {
      ...planData,
      id: `diet${Date.now()}`,
      imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(planData.name)}`, // Placeholder image
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
