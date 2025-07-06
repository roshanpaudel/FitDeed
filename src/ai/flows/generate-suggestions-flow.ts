
'use server';
/**
 * @fileOverview An AI flow to generate a single workout plan with a list of exercises from a prompt.
 *
 * - generateWorkoutFromPrompt - A function that handles the workout generation process.
 * - GenerateWorkoutFromPromptInput - The input type for the function.
 * - GenerateWorkoutFromPromptOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExerciseSchema = z.object({
  name: z.string().describe('The name of the exercise.'),
  details: z.string().describe('The details of the exercise, such as reps, sets, or duration (e.g., "3 sets of 10-12 reps").'),
});

const GenerateWorkoutFromPromptInputSchema = z.object({
  prompt: z.string().describe('The user\'s request for a workout plan.'),
});
export type GenerateWorkoutFromPromptInput = z.infer<typeof GenerateWorkoutFromPromptInputSchema>;

const GenerateWorkoutFromPromptOutputSchema = z.object({
  planName: z.string().describe('A concise and catchy name for the workout plan.'),
  planDescription: z.string().describe('A brief, one-to-two-sentence description of the workout plan.'),
  category: z.enum(['Strength Training', 'Cardiovascular', 'Flexibility & Mobility', 'HIIT']).describe('The most appropriate category for this workout.'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The difficulty level of the workout.'),
  duration: z.string().describe('The estimated total time to complete the workout, e.g., "45 minutes".'),
  exercises: z.array(ExerciseSchema).describe('A list of individual exercises for the workout plan.'),
});
export type GenerateWorkoutFromPromptOutput = z.infer<typeof GenerateWorkoutFromPromptOutputSchema>;

export async function generateWorkoutFromPrompt(input: GenerateWorkoutFromPromptInput): Promise<GenerateWorkoutFromPromptOutput> {
  return generateWorkoutFromPromptFlow(input);
}

const generateWorkoutPrompt = ai.definePrompt({
    name: 'generateWorkoutFromPrompt',
    input: { schema: GenerateWorkoutFromPromptInputSchema },
    output: { schema: GenerateWorkoutFromPromptOutputSchema },
    prompt: `You are a world-class fitness expert. Your task is to analyze a user's prompt and generate a single, complete workout plan containing a list of exercises.

User's request: "{{prompt}}"

Based on the request, generate a workout plan with a name, a short description, an appropriate category, difficulty, duration, and a list of exercises with their details (sets, reps, time, etc.).

Ensure you populate all fields in the output schema. If the user's prompt seems to be for a diet, you must still generate a workout. Create a workout plan named "Request appears to be for a diet" and explain in the description that you can currently only generate workout plans based on their request.
`,
});

const generateWorkoutFromPromptFlow = ai.defineFlow(
  {
    name: 'generateWorkoutFromPromptFlow',
    inputSchema: GenerateWorkoutFromPromptInputSchema,
    outputSchema: GenerateWorkoutFromPromptOutputSchema,
  },
  async (input) => {
    const { output } = await generateWorkoutPrompt(input);
    if (!output) {
        throw new Error("Failed to generate a workout from the prompt.");
    }
    return output;
  }
);
