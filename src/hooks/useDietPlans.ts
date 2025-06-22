
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DietPlan, DietCategory } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

interface UseDietPlansResult {
  dietPlans: DietPlan[];
  categories: DietCategory[];
  loading: boolean;
  addDietPlan: (planData: Omit<DietPlan, 'id' | 'imageUrl'>) => Promise<void>;
  getDietPlanById: (id: string) => DietPlan | undefined;
}

export function useDietPlans(): UseDietPlansResult {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [categories, setCategories] = useState<DietCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDietData = async () => {
      setLoading(true);
      try {
        // Use a different collection for diet categories
        const categoriesCollection = collection(db, 'dietCategories');
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoriesList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DietCategory));
        setCategories(categoriesList);

        const dietPlansCollection = collection(db, 'dietPlans');
        const dietPlanSnapshot = await getDocs(dietPlansCollection);
        const dietPlansList = dietPlanSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DietPlan));
        setDietPlans(dietPlansList);

      } catch (error) {
        console.error("Error fetching diet data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDietData();
  }, []);

  const addDietPlan = useCallback(async (planData: Omit<DietPlan, 'id' | 'imageUrl'>) => {
    try {
      const newPlanData = {
        ...planData,
        imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(planData.name)}`, // Placeholder image
      };
      const docRef = await addDoc(collection(db, 'dietPlans'), newPlanData);
      const newPlan = { ...newPlanData, id: docRef.id } as DietPlan;
      setDietPlans(prevPlans => [newPlan, ...prevPlans]);
    } catch (error) {
      console.error("Error adding diet plan:", error);
    }
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
