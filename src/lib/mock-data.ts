
import type { WorkoutPlan, Category, DietPlan, DietCategory } from '@/types';

export const mockCategories: Category[] = [
  { id: 'strength', name: 'Strength Training', imageUrl: 'https://placehold.co/400x300.png', description: 'Build muscle and increase power.' },
  { id: 'cardio', name: 'Cardiovascular', imageUrl: 'https://placehold.co/400x300.png', description: 'Improve heart health and endurance.' },
  { id: 'flexibility', name: 'Flexibility & Mobility', imageUrl: 'https://placehold.co/400x300.png', description: 'Enhance range of motion and prevent injuries.' },
  { id: 'hiit', name: 'HIIT', imageUrl: 'https://placehold.co/400x300.png', description: 'High-Intensity Interval Training for efficient fat burning.' },
];

export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'plan1',
    name: 'Full Body Blast',
    description: 'A comprehensive full-body workout designed to build strength and endurance.',
    category: 'strength',
    instructions: [
      'Warm-up: 5 minutes of light cardio (jogging in place, jumping jacks).',
      'Squats: 3 sets of 10-12 reps.',
      'Push-ups: 3 sets of as many reps as possible (AMRAP).',
      'Rows (Dumbbell or Resistance Band): 3 sets of 10-12 reps per arm.',
      'Overhead Press: 3 sets of 10-12 reps.',
      'Plank: 3 sets, hold for 30-60 seconds.',
      'Cool-down: 5 minutes of stretching.',
    ],
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Example video
    imageUrl: 'https://placehold.co/600x400.png',
    duration: "60 minutes",
    difficulty: "Intermediate",
  },
  {
    id: 'plan2',
    name: 'Cardio Core Burner',
    description: 'Elevate your heart rate and sculpt your core with this dynamic routine.',
    category: 'cardio',
    instructions: [
      'Warm-up: 5 minutes dynamic stretching.',
      'Jumping Jacks: 3 sets of 30 seconds, 15 seconds rest.',
      'High Knees: 3 sets of 30 seconds, 15 seconds rest.',
      'Burpees: 3 sets of 10 reps.',
      'Mountain Climbers: 3 sets of 30 seconds, 15 seconds rest.',
      'Crunches: 3 sets of 20 reps.',
      'Leg Raises: 3 sets of 15 reps.',
      'Cool-down: 5 minutes static stretching.',
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    duration: "45 minutes",
    difficulty: "Beginner",
  },
  {
    id: 'plan3',
    name: 'Morning Mobility Flow',
    description: 'Start your day with gentle movements to improve flexibility and awaken your body.',
    category: 'flexibility',
    instructions: [
      'Neck Stretches: Hold each side for 30 seconds.',
      'Shoulder Rolls: 10 forward, 10 backward.',
      'Cat-Cow Stretch: 10 reps.',
      'Downward Dog: Hold for 30-60 seconds.',
      'Child\'s Pose: Hold for 60 seconds.',
      'Hip Circles: 10 each direction.',
      'Hamstring Stretch: Hold each leg for 30 seconds.',
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    duration: "20 minutes",
    difficulty: "Beginner",
  },
  {
    id: 'plan4',
    name: 'HIIT Power Intervals',
    description: 'Short bursts of intense exercise followed by brief recovery periods.',
    category: 'hiit',
    instructions: [
      'Warm-up: 3 minutes light cardio.',
      'Sprint in place: 30 seconds.',
      'Rest: 15 seconds.',
      'Jump Squats: 30 seconds.',
      'Rest: 15 seconds.',
      'Push-ups: 30 seconds.',
      'Rest: 15 seconds.',
      'Repeat circuit 4-5 times.',
      'Cool-down: 5 minutes stretching.',
    ],
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    imageUrl: 'https://placehold.co/600x400.png',
    duration: "30 minutes",
    difficulty: "Advanced",
  },
];


export const mockDietCategories: DietCategory[] = [
  { id: 'weight-loss', name: 'Weight Loss', imageUrl: 'https://placehold.co/400x300.png', description: 'Plans focused on calorie deficit for losing weight.' },
  { id: 'muscle-gain', name: 'Muscle Gain', imageUrl: 'https://placehold.co/400x300.png', description: 'High-protein plans to support muscle growth.' },
  { id: 'balanced', name: 'Balanced Diet', imageUrl: 'https://placehold.co/400x300.png', description: 'Nutritionally complete plans for overall health.' },
  { id: 'vegan', name: 'Vegan', imageUrl: 'https://placehold.co/400x300.png', description: 'Plant-based diet plans.' },
  { id: 'keto', name: 'Ketogenic', imageUrl: 'https://placehold.co/400x300.png', description: 'Low-carb, high-fat diet plans.' },
];

export const mockDietPlans: DietPlan[] = [
  {
    id: 'diet1',
    name: 'Lean Gain Diet',
    description: 'A balanced diet plan for lean muscle gain, focusing on whole foods.',
    category: 'muscle-gain',
    instructions: [
      'Breakfast: Oatmeal with protein powder and berries.',
      'Snack: Greek yogurt with almonds.',
      'Lunch: Grilled chicken salad with mixed greens and quinoa.',
      'Snack: Apple slices with peanut butter.',
      'Dinner: Baked salmon with roasted vegetables and brown rice.',
    ],
    caloriesPerDay: '2500-2800 kcal',
    protein: '150-180g',
    carbs: '250-300g',
    fat: '70-80g',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'diet2',
    name: 'Vegan Weight Management',
    description: 'A plant-based diet plan designed for sustainable weight loss.',
    category: 'vegan',
    instructions: [
      'Breakfast: Tofu scramble with spinach and whole-wheat toast.',
      'Snack: Handful of mixed nuts.',
      'Lunch: Lentil soup with a side of whole-grain bread.',
      'Snack: Hummus with carrot and cucumber sticks.',
      'Dinner: Chickpea curry with brown rice and steamed broccoli.',
    ],
    caloriesPerDay: '1800-2000 kcal',
    protein: '70-90g',
    carbs: '200-240g',
    fat: '60-70g',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];
