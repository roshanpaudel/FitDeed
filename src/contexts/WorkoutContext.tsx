
'use client';

import type { WorkoutPlan, Category } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { mockWorkoutPlans, mockCategories } from '@/lib/mock-data';

interface WorkoutContextType {
  workoutPlans: WorkoutPlan[];
  categories: Category[];
  favoritePlanIds: string[];
  addWorkoutPlan: (plan: Omit<WorkoutPlan, 'id' | 'imageUrl'>) => Promise<void>;
  toggleFavorite: (planId: string) => void;
  getWorkoutById: (id: string) => WorkoutPlan | undefined;
  getFavoriteWorkouts: () => WorkoutPlan[];
  loading: boolean;
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Helper to get initial favorites from localStorage
const getInitialFavorites = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedFavorites = localStorage.getItem('fitplanFavoritePlanIds');
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [favoritePlanIds, setFavoritePlanIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Set initial state after mount to avoid hydration issues
  useEffect(() => {
    setFavoritePlanIds(getInitialFavorites());
    setLoading(false);
  }, []);

  // Sync favorites with localStorage whenever they change
  useEffect(() => {
    // Only run on client after initial state is set
    if (!loading) {
      localStorage.setItem('fitplanFavoritePlanIds', JSON.stringify(favoritePlanIds));
    }
  }, [favoritePlanIds, loading]);

  const addWorkoutPlan = async (planData: Omit<WorkoutPlan, 'id' | 'imageUrl'>) => {
    const newPlan: WorkoutPlan = {
      ...planData,
      id: `plan${Date.now()}`,
      imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(planData.name)}`,
    };
    setWorkoutPlans(prevPlans => [newPlan, ...prevPlans]);
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

  const getWorkoutById = (id: string) => {
    return workoutPlans.find(plan => plan.id === id);
  };

  const getFavoriteWorkouts = () => {
    return workoutPlans.filter(plan => favoritePlanIds.includes(plan.id));
  };
  
  return (
    <WorkoutContext.Provider value={{ workoutPlans, categories, favoritePlanIds, addWorkoutPlan, toggleFavorite, getWorkoutById, getFavoriteWorkouts, loading }}>
      {children}
    </WorkoutContext.Provider>
  );
};
