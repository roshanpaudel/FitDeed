
'use client';

import type { DietPlan, DietCategory } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { mockDietPlans, mockDietCategories } from '@/lib/mock-data';

interface DietPlanContextType {
  dietPlans: DietPlan[];
  categories: DietCategory[];
  favoritePlanIds: string[];
  addDietPlan: (plan: Omit<DietPlan, 'id' | 'imageUrl'>) => Promise<void>;
  toggleFavorite: (planId: string) => void;
  getDietPlanById: (id: string) => DietPlan | undefined;
  getFavoriteDietPlans: () => DietPlan[];
  loading: boolean;
}

export const DietPlanContext = createContext<DietPlanContextType | undefined>(undefined);

const getInitialFavorites = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedFavorites = localStorage.getItem('fitdeedFavoriteDietPlanIds');
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

export const DietPlanProvider = ({ children }: { children: ReactNode }) => {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(mockDietPlans);
  const [categories, setCategories] = useState<DietCategory[]>(mockDietCategories);
  const [favoritePlanIds, setFavoritePlanIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFavoritePlanIds(getInitialFavorites());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('fitdeedFavoriteDietPlanIds', JSON.stringify(favoritePlanIds));
    }
  }, [favoritePlanIds, loading]);

  const addDietPlan = async (planData: Omit<DietPlan, 'id' | 'imageUrl'>) => {
    const newPlan: DietPlan = {
      ...planData,
      id: `diet${Date.now()}`,
      imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(planData.name)}`,
    };
    setDietPlans(prevPlans => [newPlan, ...prevPlans]);
  };

  const toggleFavorite = (planId: string) => {
    setFavoritePlanIds(prevIds => {
      const isFavorited = prevIds.includes(planId);
      if (isFavorited) {
        return prevIds.filter(id => id !== planId);
      } else {
        return [...prevIds, planId];
      }
    });
  };

  const getDietPlanById = (id: string) => {
    return dietPlans.find(plan => plan.id === id);
  };

  const getFavoriteDietPlans = () => {
    return dietPlans.filter(plan => favoritePlanIds.includes(plan.id));
  };
  
  return (
    <DietPlanContext.Provider value={{ dietPlans, categories, favoritePlanIds, addDietPlan, toggleFavorite, getDietPlanById, getFavoriteDietPlans, loading }}>
      {children}
    </DietPlanContext.Provider>
  );
};
