'use client';

import type { WorkoutPlan, Category } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { mockWorkoutPlans, mockCategories } from '@/lib/mock-data';

interface WorkoutContextType {
  workoutPlans: WorkoutPlan[];
  categories: Category[];
  favoritePlanIds: string[];
  addWorkoutPlan: (plan: Omit<WorkoutPlan, 'id' | 'imageUrl'>) => void;
  toggleFavorite: (planId: string) => void;
  getWorkoutById: (id: string) => WorkoutPlan | undefined;
  getFavoriteWorkouts: () => WorkoutPlan[];
  loading: boolean;
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [categories] = useState<Category[]>(mockCategories);
  const [favoritePlanIds, setFavoritePlanIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('fitplanFavorites');
    if (storedFavorites) {
      setFavoritePlanIds(JSON.parse(storedFavorites));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if(!loading) { // Avoid writing initial empty array if still loading
        localStorage.setItem('fitplanFavorites', JSON.stringify(favoritePlanIds));
    }
  }, [favoritePlanIds, loading]);

  const addWorkoutPlan = (planData: Omit<WorkoutPlan, 'id' | 'imageUrl'>) => {
    const newPlan: WorkoutPlan = {
      ...planData,
      id: `plan${Date.now()}`,
      imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(planData.name)}`,
    };
    setWorkoutPlans(prevPlans => [newPlan, ...prevPlans]);
  };

  const toggleFavorite = (planId: string) => {
    setFavoritePlanIds(prevIds =>
      prevIds.includes(planId)
        ? prevIds.filter(id => id !== planId)
        : [...prevIds, planId]
    );
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
