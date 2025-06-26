
'use client';

import type { WorkoutPlan, Category } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

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
  const { user } = useAuth(); // Get the current authenticated user

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
        // Loading state will be set to false after fetching favorites as well
      }
    };

    const fetchFavorites = async () => {
      if (user) {
        try {
          const favoritesDocRef = doc(db, 'favorites', user.uid);
          const favoritesDocSnap = await getDoc(favoritesDocRef);

          if (favoritesDocSnap.exists()) {
            const data = favoritesDocSnap.data();
            // Assuming favorites are stored as an array named 'planIds'
            setFavoritePlanIds((data.planIds as string[]) || []);
          } else {
            setFavoritePlanIds([]);
          }
        } catch (error) {
          console.error("Error fetching favorites from Firestore:", error);
          setFavoritePlanIds([]); // Reset favorites on error
        } finally {
           setLoading(false);
        }
      } else {
         setFavoritePlanIds([]); // Clear favorites if user logs out
         setLoading(false); // Ensure loading is false even if no user
      }
    };

    fetchWorkoutData();
    fetchFavorites();

    // Clean up local storage logic
    // localStorage.removeItem('fitplanFavorites');
  }, [user]); // Re-run effect when user changes (login/logout)


  const addWorkoutPlan = async (planData: Omit<WorkoutPlan, 'id' | 'imageUrl'>) => {
    try {
      const newPlanData = {
        ...planData,
        imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(planData.name)}`,
      };
      const docRef = await addDoc(collection(db, "workoutPlans"), newPlanData);
      const newPlan = { ...newPlanData, id: docRef.id } as WorkoutPlan;
      setWorkoutPlans(prevPlans => [newPlan, ...prevPlans]);
      // Optionally show a success toast
    } catch (error) {
        console.error("Error adding workout plan: ", error);
        // Here you might want to show a toast to the user
    }
  };

  const toggleFavorite = async (planId: string) => {
    if (!user) {
      // Handle case where user is not logged in (e.g., show a prompt to log in)
      console.log("Please log in to favorite plans.");
      // Optionally show a toast or redirect to login
      return;
    }

    const isFavorited = favoritePlanIds.includes(planId);
    const updatedFavorites = isFavorited
? favoritePlanIds.filter(id => id !== planId)
: [...favoritePlanIds, planId];

    setFavoritePlanIds(updatedFavorites); // Optimistic update

    try {
      const favoritesDocRef = doc(db, 'favorites', user.uid);
      await setDoc(favoritesDocRef, { planIds: updatedFavorites }, { merge: true }); // Use merge: true to not overwrite other fields if they exist
    } catch (error) {
      console.error("Error updating favorites in Firestore:", error);
      // Revert the optimistic update if saving to Firestore fails
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

