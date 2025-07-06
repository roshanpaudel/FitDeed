'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, BarChartBig, Tag, Heart, PlayCircle, Loader2, Trash2, Wand2 } from 'lucide-react';
import type { WorkoutPlan } from '@/types';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateWorkoutFromPrompt, type GenerateWorkoutFromPromptInput, type GenerateWorkoutFromPromptOutput } from '@/ai/flows/generate-suggestions-flow';


export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getWorkoutById, toggleFavorite, favoritePlanIds, loading: workoutsLoading, deleteWorkoutPlan, updateWorkoutPlan } = useWorkouts();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // New state for AI update
  const [updatePrompt, setUpdatePrompt] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id && !workoutsLoading) {
      const foundPlan = getWorkoutById(id);
      setPlan(foundPlan || null);
      setLoading(false);
    }
  }, [id, getWorkoutById, workoutsLoading]);
  
  const handleDelete = () => {
    if (!plan) return;
    toast({
      title: 'Plan Deleted',
      description: `"${plan.name}" has been removed.`,
    });
    deleteWorkoutPlan(plan.id);
  };

  const handleUpdate = async () => {
    if (!plan || !updatePrompt.trim()) return;

    setIsUpdating(true);

    try {
      // Convert current plan instructions to AI-friendly format
      const currentExercises = plan.instructions.map(inst => {
        const parts = inst.split(':');
        return {
          name: parts[0]?.trim() || 'Exercise',
          details: parts.slice(1).join(':').trim() || 'No details',
        };
      });

      const history = [{
        role: 'model' as const,
        content: JSON.stringify({
          planName: plan.name,
          planDescription: plan.description,
          category: plan.category,
          difficulty: plan.difficulty,
          duration: plan.duration,
          exercises: currentExercises,
        })
      }];

      const input: GenerateWorkoutFromPromptInput = {
        prompt: updatePrompt,
        history,
      };

      const output: GenerateWorkoutFromPromptOutput = await generateWorkoutFromPrompt(input);
      
      const updatedPlanData = {
        name: output.planName,
        description: output.planDescription,
        category: output.category,
        difficulty: output.difficulty,
        duration: output.duration,
        instructions: output.exercises.map(ex => `${ex.name}: ${ex.details}`),
      };

      // Call context function to update the plan
      updateWorkoutPlan(plan.id, updatedPlanData);
      const updatedPlan = getWorkoutById(plan.id);
      setPlan(updatedPlan || null);


      toast({ title: 'Plan Updated!', description: 'Your workout plan has been modified by AI.' });
      setUpdatePrompt(''); // Clear prompt
    } catch (error) {
      console.error("AI update failed:", error);
      toast({ title: "AI Error", description: "Something went wrong while updating the plan. Please try again.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };


  if (loading || workoutsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Workout Plan Not Found</h1>
        <p className="text-muted-foreground mb-6">The workout plan you are looking for does not exist or may have been removed.</p>
        <Button onClick={() => router.push('/workouts')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workouts
        </Button>
      </div>
    );
  }

  const isFavorite = favoritePlanIds.includes(plan.id);

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="p-0">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={plan.imageUrl}
              alt={plan.name}
              layout="fill"
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
              data-ai-hint="workout exercise"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
             <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-white">{plan.name}</h1>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {plan.category && <Badge variant="secondary" className="text-sm py-1 px-3"><Tag className="mr-1.5 h-4 w-4" />{plan.category}</Badge>}
              {plan.duration && <Badge variant="outline" className="text-sm py-1 px-3"><Clock className="mr-1.5 h-4 w-4" />{plan.duration}</Badge>}
              {plan.difficulty && <Badge variant="outline" className="text-sm py-1 px-3"><BarChartBig className="mr-1.5 h-4 w-4" />{plan.difficulty}</Badge>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                variant="default"
                size="lg"
                onClick={() => toggleFavorite(plan.id)}
                className={cn(
                    "flex-grow transition-colors",
                    isFavorite ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
                )}
                >
                <Heart className="mr-2 h-5 w-5" /> {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="lg" className="flex-grow">
                        <Trash2 className="mr-2 h-5 w-5" /> Delete Plan
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this workout plan.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({ variant: "destructive" }))}>
                            Yes, delete plan
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{plan.description}</p>

          {plan.mediaUrl && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center gap-2"><PlayCircle className="text-primary h-6 w-6" /> Video Guide</h3>
              <div className="aspect-video rounded-lg overflow-hidden border">
                <video controls className="w-full h-full" src={plan.mediaUrl} title={`${plan.name} video guide`}>
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold font-headline">Instructions</h3>
            <ul className="list-none space-y-3 pl-0">
              {plan.instructions.map((step, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </div>
           <div className="space-y-4 pt-6 border-t">
            <h3 className="text-2xl font-semibold font-headline flex items-center gap-2"><Wand2 className="h-6 w-6 text-primary" /> Update with AI</h3>
            <p className="text-muted-foreground">
              Need to make a change? Tell the AI what you want to modify, add, or remove. For example: "add a 10 minute warm up" or "replace push-ups with dumbbell press".
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., make this a 30 minute workout"
                value={updatePrompt}
                onChange={(e) => setUpdatePrompt(e.target.value)}
                disabled={isUpdating}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              />
              <Button onClick={handleUpdate} disabled={isUpdating || !updatePrompt.trim()}>
                {isUpdating ? <Loader2 className="animate-spin" /> : "Update"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
