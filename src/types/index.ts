

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  category: string;
  instructions: string[];
  mediaUrl?: string; // URL for video or GIF
  imageUrl: string; // URL for placeholder image
  duration?: string; // e.g., "30 minutes"
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., Weight Loss, Muscle Gain, Vegan
  instructions: string[]; // Meal details, recipes, guidelines. Each string is a step/paragraph.
  caloriesPerDay?: string; // e.g., "2000-2200 kcal"
  protein?: string; // e.g., "150g" or "30%"
  carbs?: string;   // e.g., "200g" or "40%"
  fat?: string;     // e.g., "70g" or "30%"
  imageUrl: string; // URL for placeholder image
}

// DietCategory can reuse the existing Category type if the structure is the same
export type DietCategory = Category;
