
'use server';
/**
 * @fileOverview An AI flow to generate workout or diet plans based on a user prompt.
 *
 * - generatePlan - A function that handles the plan generation process.
 * - GeneratePlanInput - The input type for the generatePlan function.
 * - GeneratePlanOutput - The return type for the generatePlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schema for the data required by the workout form
const WorkoutPlanDataSchema = z.object({
  name: z.string().describe('A concise and catchy name for the workout plan.'),
  description: z.string().describe('A brief, one-to-two-sentence description of the workout plan.'),
  category: z.string().describe('The most appropriate category for this workout. Choose from Strength Training, Cardiovascular, Flexibility & Mobility, or HIIT.'),
  instructions: z.string().describe('The step-by-step instructions for the workout. Each step should be on a new line.'),
  duration: z.string().optional().describe('The estimated total time to complete the workout, e.g., "45 minutes".'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional().describe('The difficulty level of the workout.'),
});

// Schema for the data required by the diet form
const DietPlanDataSchema = z.object({
    name: z.string().describe('A concise and appealing name for the diet plan.'),
    description: z.string().describe('A brief, one-to-two-sentence description of the diet plan.'),
    category: z.string().describe('The most appropriate category for this diet plan. Choose from Weight Loss, Muscle Gain, Balanced Diet, Vegan, or Ketogenic.'),
    instructions: z.string().describe('Detailed meal plan or instructions. Each meal or instruction should be on a new line.'),
    caloriesPerDay: z.string().optional().describe('The estimated total daily calorie intake, e.g., "2200 kcal".'),
    protein: z.string().optional().describe('The target daily protein intake, e.g., "150g" or "30%".'),
    carbs: z.string().optional().describe('The target daily carbohydrate intake, e.g., "250g" or "40%".'),
    fat: z.string().optional().describe('The target daily fat intake, e.g., "70g" or "30%".'),
});


const GeneratePlanInputSchema = z.object({
  prompt: z.string().describe('The user\'s request for a workout or diet plan.'),
  planType: z.enum(['workout', 'diet']).describe('The type of plan to generate.'),
});
export type GeneratePlanInput = z.infer<typeof GeneratePlanInputSchema>;

const GeneratePlanOutputSchema = z.object({
  workout: WorkoutPlanDataSchema.optional().describe('The generated workout plan data. Provide this only if planType was "workout".'),
  diet: DietPlanDataSchema.optional().describe('The generated diet plan data. Provide this only if planType was "diet".'),
});
export type GeneratePlanOutput = z.infer<typeof GeneratePlanOutputSchema>;


export async function generatePlan(input: GeneratePlanInput): Promise<GeneratePlanOutput> {
  return generatePlanFlow(input);
}


const generatePlanPrompt = ai.definePrompt({
    name: 'generatePlanPrompt',
    input: { schema: GeneratePlanInputSchema },
    output: { schema: GeneratePlanOutputSchema },
    prompt: `You are a world-class fitness and nutrition expert. Your task is to generate a detailed plan based on the user's prompt.

The user wants to create a {{planType}} plan.

User's request: "{{prompt}}"

Based on the request, generate a complete and well-structured {{planType}} plan. Fill in all the relevant fields in the output format. Ensure the instructions are clear, concise, and formatted with each step on a new line. The category must be one of the provided options.
`,
});


const generatePlanFlow = ai.defineFlow(
  {
    name: 'generatePlanFlow',
    inputSchema: GeneratePlanInputSchema,
    outputSchema: GeneratePlanOutputSchema,
  },
  async (input) => {
    const { output } = await generatePlanPrompt(input);
    if (!output) {
        throw new Error("Failed to generate a plan from the prompt.");
    }
    return output;
  }
);
