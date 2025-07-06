
'use server';
/**
 * @fileOverview An AI flow to generate or update a single workout plan with a list of exercises from a prompt and conversation history.
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

const HistoryItemSchema = z.object({
    role: z.enum(['user', 'model']),
    // The model content will be a structured JSON string of the GenerateWorkoutFromPromptOutput schema.
    content: z.string(),
});

const GenerateWorkoutFromPromptInputSchema = z.object({
  prompt: z.string().describe("The user's request for a workout plan or a modification to the previous one."),
  history: z.array(HistoryItemSchema).optional().describe('The conversation history to provide context for follow-up requests.'),
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
    system: `You are a world-class fitness expert. Your task is to create a complete workout plan based on a user's prompt.
If the user provides a follow-up request, you must modify the plan from the conversation history based on their new request. The model's turns in the history contain the JSON of the previously generated plan.
Generate a new or updated plan with a name, description, category, difficulty, duration, and a list of exercises.
Ensure you populate all fields in the output schema. If the prompt seems to be for a diet, you must still generate a workout and explain in the description that you can only generate workout plans.`,
    prompt: `{{#if history}}
This is the conversation history so far:
{{#each history}}
- {{this.role}}: {{{this.content}}}
{{/each}}
{{/if}}

Now, process the following user request: "{{prompt}}"`,
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
