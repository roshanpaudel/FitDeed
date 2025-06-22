
'use client';

import type { WorkoutPlan, Category } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

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

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favoritePlanIds, setFavoritePlanIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      setLoading(true);
      try {
        // Fetch Categories
        const categoriesCollection = collection(db, 'categories');
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoriesList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(categoriesList);

        // Fetch Workout Plans
        const workoutPlansCollection = collection(db, 'workoutPlans');
        const workoutPlanSnapshot = await getDocs(workoutPlansCollection);
        const workoutPlansList = workoutPlanSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutPlan));
        setWorkoutPlans(workoutPlansList);

      } catch (error) {
        console.error("Error fetching workout data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutData();

    const storedFavorites = localStorage.getItem('fitplanFavorites');
    if (storedFavorites) {
      setFavoritePlanIds(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    if(!loading) { // Avoid writing initial empty array if still loading
        localStorage.setItem('fitplanFavorites', JSON.stringify(favoritePlanIds));
    }
  }, [favoritePlanIds, loading]);

  const addWorkoutPlan = async (planData: Omit<WorkoutPlan, 'id' | 'imageUrl'>) => {
    try {
      const newPlanData = {
        ...planData,
        imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(planData.name)}`,
      };
      const docRef = await addDoc(collection(db, "workoutPlans"), newPlanData);
      const newPlan = { ...newPlanData, id: docRef.id } as WorkoutPlan;
      setWorkoutPlans(prevPlans => [newPlan, ...prevPlans]);
    } catch (error) {
        console.error("Error adding workout plan: ", error);
        // Here you might want to show a toast to the user
    }
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
