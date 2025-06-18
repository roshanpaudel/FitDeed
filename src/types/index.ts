
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
