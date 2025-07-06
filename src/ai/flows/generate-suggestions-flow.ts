
'use server';
/**
 * @fileOverview An AI flow to generate multiple workout or diet plan suggestions based on a user prompt.
 *
 * - generateSuggestions - A function that handles the suggestion generation process.
 * - GenerateSuggestionsInput - The input type for the generateSuggestions function.
 * - GenerateSuggestionsOutput - The return type for the generateSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Re-using schemas from the single plan generation flow.
const WorkoutPlanDataSchema = z.object({
  name: z.string().describe('A concise and catchy name for the workout plan.'),
  description: z.string().describe('A brief, one-to-two-sentence description of the workout plan.'),
  category: z.enum(['Strength Training', 'Cardiovascular', 'Flexibility & Mobility', 'HIIT']).describe('The most appropriate category for this workout.'),
  instructions: z.string().describe('The step-by-step instructions for the workout. Each step should be on a new line.'),
  duration: z.string().optional().describe('The estimated total time to complete the workout, e.g., "45 minutes".'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional().describe('The difficulty level of the workout.'),
});
export type WorkoutSuggestion = z.infer<typeof WorkoutPlanDataSchema>;


const DietPlanDataSchema = z.object({
    name: z.string().describe('A concise and appealing name for the diet plan.'),
    description: z.string().describe('A brief, one-to-two-sentence description of the diet plan.'),
    category: z.enum(['Weight Loss', 'Muscle Gain', 'Balanced Diet', 'Vegan', 'Ketogenic']).describe('The most appropriate category for this diet plan.'),
    instructions: z.string().describe('Detailed meal plan or instructions. Each meal or instruction should be on a new line.'),
    caloriesPerDay: z.string().optional().describe('The estimated total daily calorie intake, e.g., "2200 kcal".'),
    protein: z.string().optional().describe('The target daily protein intake, e.g., "150g" or "30%".'),
    carbs: z.string().optional().describe('The target daily carbohydrate intake, e.g., "250g" or "40%".'),
    fat: z.string().optional().describe('The target daily fat intake, e.g., "70g" or "30%".'),
});
export type DietSuggestion = z.infer<typeof DietPlanDataSchema>;


const GenerateSuggestionsInputSchema = z.object({
  prompt: z.string().describe('The user\'s request for workout or diet plan suggestions.'),
});
export type GenerateSuggestionsInput = z.infer<typeof GenerateSuggestionsInputSchema>;

const GenerateSuggestionsOutputSchema = z.object({
  planType: z.enum(['workout', 'diet']).describe('The type of plan generated based on the prompt.'),
  workouts: z.array(WorkoutPlanDataSchema).optional().describe("An array of workout plan suggestions. Populate this only if planType is 'workout'"),
  diets: z.array(DietPlanDataSchema).optional().describe("An array of diet plan suggestions. Populate this only if planType is 'diet'"),
});
export type GenerateSuggestionsOutput = z.infer<typeof GenerateSuggestionsOutputSchema>;


export async function generateSuggestions(input: GenerateSuggestionsInput): Promise<GenerateSuggestionsOutput> {
  return generateSuggestionsFlow(input);
}


const generateSuggestionsPrompt = ai.definePrompt({
    name: 'generateSuggestionsPrompt',
    input: { schema: GenerateSuggestionsInputSchema },
    output: { schema: GenerateSuggestionsOutputSchema },
    prompt: `You are a world-class fitness and nutrition expert. Your task is to analyze a user's prompt and generate a list of 3 distinct plan suggestions.

First, determine if the user is asking for "workout" plans or "diet" plans. Set the 'planType' field in your response accordingly.

User's request: "{{prompt}}"

Based on the request, generate an array of 3 complete and well-structured plan suggestions.
- If it's a workout request, populate the 'workouts' array.
- If it's a diet request, populate the 'diets' array.
- Do NOT populate both arrays. Only one should be used based on the planType.

Fill in all the relevant fields for each suggestion in the appropriate array. Ensure the instructions are clear and formatted with each step on a new line. The category for each must be one of the provided options. If the prompt is ambiguous, default to generating workout plan suggestions.
`,
});


const generateSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateSuggestionsFlow',
    inputSchema: GenerateSuggestionsInputSchema,
    outputSchema: GenerateSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateSuggestionsPrompt(input);
    if (!output) {
        throw new Error("Failed to generate suggestions from the prompt.");
    }
    return output;
  }
);
