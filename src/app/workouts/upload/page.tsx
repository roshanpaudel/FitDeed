
'use client';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useDietPlans } from "@/hooks/useDietPlans";
import { useToast } from "@/hooks/use-toast";
import ProtectedPage from "@/components/ProtectedPage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Utensils, Zap, Wand2, Loader2 } from "lucide-react";
import { generatePlan, type GeneratePlanInput } from '@/ai/flows/generate-plan-flow';


const workoutFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500),
  category: z.string().min(1, "Please select a category."),
  instructions: z.string().min(10, "Instructions must be provided."),
  mediaUrl: z.string().url("Must be a valid URL (e.g., for a video or GIF).").optional().or(z.literal('')),
  duration: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

const dietPlanFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500),
  category: z.string().min(1, "Please select a diet category."),
  instructions: z.string().min(10, "Meal plan details must be provided."),
  caloriesPerDay: z.string().optional(),
  protein: z.string().optional(),
  carbs: z.string().optional(),
  fat: z.string().optional(),
});

type DietPlanFormValues = z.infer<typeof dietPlanFormSchema>;

function UploadPlanPageContent() {
  const { categories: workoutCategories, addWorkoutPlan, loading: workoutLoading } = useWorkouts();
  const { categories: dietCategories, addDietPlan, loading: dietLoading } = useDietPlans();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("workout");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);


  const workoutForm = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      instructions: "",
      mediaUrl: "",
      duration: "",
      difficulty: undefined,
    },
  });

  const dietForm = useForm<DietPlanFormValues>({
    resolver: zodResolver(dietPlanFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      instructions: "",
      caloriesPerDay: "",
      protein: "",
      carbs: "",
      fat: "",
    },
  });

  async function onWorkoutSubmit(data: WorkoutFormValues) {
    await addWorkoutPlan({
      ...data,
      instructions: data.instructions.split('\n').map(s => s.trim()).filter(s => s.length > 0),
    });
    toast({
      title: "Workout Uploaded!",
      description: `${data.name} has been added to the database.`,
      variant: "default",
    });
    workoutForm.reset();
  }

  async function onDietPlanSubmit(data: DietPlanFormValues) {
    await addDietPlan({
        ...data,
        instructions: data.instructions.split('\n').map(s => s.trim()).filter(s => s.length > 0),
    });
    toast({
      title: "Diet Uploaded!",
      description: `${data.name} has been added to the database.`,
      variant: "default",
    });
    dietForm.reset();
  }

  const handleGeneratePlan = async () => {
    if (!aiPrompt.trim()) {
        toast({ title: "Prompt is empty", description: "Please enter a description of the plan you want to create.", variant: "destructive" });
        return;
    }
    setIsGenerating(true);
    try {
        const input: GeneratePlanInput = {
            prompt: aiPrompt,
            planType: activeTab as 'workout' | 'diet',
        };
        const result = await generatePlan(input);
        
        if (activeTab === 'workout' && result.workout) {
            workoutForm.reset(result.workout);
            toast({ title: "Workout Plan Generated!", description: "The workout form has been populated by AI." });
        } else if (activeTab === 'diet' && result.diet) {
            dietForm.reset(result.diet);
            toast({ title: "Diet Plan Generated!", description: "The diet form has been populated by AI." });
        } else {
             toast({ title: "Generation Error", description: "The AI couldn't generate the requested plan. Please try a different prompt.", variant: "destructive" });
        }

    } catch (error) {
        console.error("AI generation failed:", error);
        toast({ title: "AI Error", description: "Something went wrong while generating the plan. Please try again.", variant: "destructive" });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fadeIn">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            {activeTab === "workout" ? <Zap className="h-8 w-8 text-primary" /> : <Utensils className="h-8 w-8 text-primary" />}
            <CardTitle className="text-3xl font-headline">{activeTab === 'workout' ? 'Upload New Workout' : 'Upload New Diet'}</CardTitle>
          </div>
          <CardDescription>
            Fill in the details manually or use our AI assistant to generate a plan from a prompt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <FormLabel htmlFor="ai-prompt" className="font-semibold flex items-center gap-2 text-base">
                <Wand2 className="h-5 w-5 text-primary"/>
                Generate with AI
            </FormLabel>
            <div className="flex gap-2">
                <Input 
                    id="ai-prompt"
                    placeholder={`e.g., a 30 minute beginner HIIT workout`}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    disabled={isGenerating}
                />
                <Button onClick={handleGeneratePlan} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="animate-spin" /> : "Generate"}
                </Button>
            </div>
             <FormDescription>
                Describe the {activeTab} you want to create and let AI fill out the form for you.
            </FormDescription>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="workout" disabled={isGenerating}>Workout</TabsTrigger>
              <TabsTrigger value="diet" disabled={isGenerating}>Diet</TabsTrigger>
            </TabsList>
            <TabsContent value="workout">
              <Form {...workoutForm}>
                <form onSubmit={workoutForm.handleSubmit(onWorkoutSubmit)} className="space-y-6">
                  <FormField
                    control={workoutForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Morning Yoga Flow" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={workoutForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Briefly describe the workout." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={workoutForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workoutCategories.map(cat => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={workoutForm.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter each step on a new line." {...field} rows={6} />
                        </FormControl>
                        <FormDescription>
                          Each line will be treated as a separate instruction.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={workoutForm.control}
                    name="mediaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/workout.mp4" {...field} />
                        </FormControl>
                        <FormDescription>Link to a video or GIF for this workout.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={workoutForm.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 30 minutes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={workoutForm.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={workoutLoading || isGenerating}>
                    <UploadCloud className="mr-2 h-5 w-5" /> {workoutLoading ? 'Uploading...' : 'Upload Workout'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="diet">
              <Form {...dietForm}>
                <form onSubmit={dietForm.handleSubmit(onDietPlanSubmit)} className="space-y-6">
                  <FormField
                    control={dietForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diet Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Healthy Vegan Meal Plan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={dietForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Briefly describe the diet." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={dietForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diet Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a diet category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dietCategories.map(cat => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={dietForm.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Details / Instructions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter meal details, recipes, or guidelines. Each line can be a new meal or instruction." {...field} rows={6} />
                        </FormControl>
                         <FormDescription>
                          Each line will be treated as a separate part of the diet.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={dietForm.control}
                      name="caloriesPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories Per Day (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2000 kcal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={dietForm.control}
                        name="protein"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Protein (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 150g or 30%" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField
                        control={dietForm.control}
                        name="carbs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Carbohydrates (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 200g or 40%" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={dietForm.control}
                        name="fat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fat (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 70g or 30%" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={dietLoading || isGenerating}>
                    <UploadCloud className="mr-2 h-5 w-5" /> {dietLoading ? 'Uploading...' : 'Upload Diet'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UploadPlanPage() {
   const { loading: workoutLoading } = useWorkouts();
   const { loading: dietLoading } = useDietPlans();
  return (
    <ProtectedPage componentLoading={workoutLoading || dietLoading}>
      <UploadPlanPageContent />
    </ProtectedPage>
  );
}
