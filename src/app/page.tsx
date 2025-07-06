
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWorkouts } from '@/hooks/useWorkouts';
import { ArrowRight, Zap, Wand2, Loader2, ListPlus } from 'lucide-react';
import type { Category } from '@/types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { generateWorkoutFromPrompt, type GenerateWorkoutFromPromptInput, type GenerateWorkoutFromPromptOutput } from '@/ai/flows/generate-suggestions-flow';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// New component for the AI generation section
function AiGenerationSection() {
    const { toast } = useToast();
    const { addWorkoutPlan } = useWorkouts();

    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<GenerateWorkoutFromPromptOutput | null>(null);
    const [selectedExerciseIndices, setSelectedExerciseIndices] = useState<number[]>([]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast({ title: "Prompt is empty", description: "Please enter a description for the plans you want.", variant: "destructive" });
            return;
        }
        setIsGenerating(true);
        setResults(null);
        setSelectedExerciseIndices([]);
        try {
            const input: GenerateWorkoutFromPromptInput = { prompt };
            const output = await generateWorkoutFromPrompt(input);
            setResults(output);
            // Auto-select all exercises by default
            if (output?.exercises) {
                setSelectedExerciseIndices(output.exercises.map((_, index) => index));
            }
        } catch (error) {
            console.error("AI generation failed:", error);
            toast({ title: "AI Error", description: "Something went wrong while generating the workout. Please try again.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExerciseSelectionChange = (index: number, isSelected: boolean) => {
        if (isSelected) {
            setSelectedExerciseIndices(prev => [...prev, index]);
        } else {
            setSelectedExerciseIndices(prev => prev.filter(i => i !== index));
        }
    };
    
    const handleAddPlan = async () => {
        if (!results || selectedExerciseIndices.length === 0) return;

        toast({ title: "Adding Plan...", description: `Adding ${results.planName} to your workout library.` });
        
        const selectedExercises = results.exercises.filter((_, index) => selectedExerciseIndices.includes(index));
        
        const newPlan = {
            name: results.planName,
            description: results.planDescription,
            category: results.category,
            difficulty: results.difficulty,
            duration: results.duration,
            instructions: selectedExercises.map(ex => `${ex.name}: ${ex.details}`),
        };

        await addWorkoutPlan(newPlan);

        toast({ title: "Success!", description: `${results.planName} has been added. Find it in 'Workouts'.`, variant: "default"});
        setResults(null);
        setSelectedExerciseIndices([]);
    };
    
    return (
        <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-lg shadow-lg">
            <div className="container mx-auto px-4">
                <Wand2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary animate-slideInUp">
                    Generate Your Perfect Workout
                </h1>
                <p className="text-lg md:text-xl text-foreground mb-8 max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                    Describe your ideal workout, and let our AI create a personalized plan for you to customize and save.
                </p>
                <div className="max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                    <div className="flex gap-2">
                        <Input
                            id="ai-prompt-home"
                            placeholder="e.g., a 30-minute full body workout for beginners"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isGenerating}
                            className="text-base"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
                            {isGenerating ? <Loader2 className="animate-spin" /> : "Generate"}
                        </Button>
                    </div>
                </div>

                {isGenerating && (
                    <div className="mt-12 flex justify-center items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                )}
                
                {results && !isGenerating && (
                    <div className="mt-12 text-left animate-fadeIn max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">{results.planName}</CardTitle>
                                <CardDescription>{results.planDescription}</CardDescription>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Badge variant="secondary">{results.category}</Badge>
                                    <Badge variant="outline">{results.difficulty}</Badge>
                                    <Badge variant="outline">{results.duration}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="font-semibold mb-3 text-lg">Exercises (select to include)</h3>
                                <ul className="space-y-3">
                                    {results.exercises.map((exercise, index) => (
                                        <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                                            <Checkbox
                                                id={`exercise-${index}`}
                                                className="mt-1"
                                                checked={selectedExerciseIndices.includes(index)}
                                                onCheckedChange={(checked) => handleExerciseSelectionChange(index, checked as boolean)}
                                            />
                                            <Label htmlFor={`exercise-${index}`} className="flex flex-col cursor-pointer">
                                                <span className="font-medium">{exercise.name}</span>
                                                <span className="text-sm text-muted-foreground">{exercise.details}</span>
                                            </Label>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <div className="mt-6 text-center">
                            <Button 
                                size="lg" 
                                onClick={handleAddPlan}
                                disabled={selectedExerciseIndices.length === 0}
                            >
                                <ListPlus className="mr-2" />
                                Add Plan ({selectedExerciseIndices.length} exercises)
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}


export default function HomePage() {
  const { categories, loading } = useWorkouts();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
         <Zap className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* AI Generation Section */}
      <AiGenerationSection />

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold font-headline mb-8 text-center">Or Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category: Category, index: number) => (
            <Link key={category.id} href={`/workouts?category=${category.id}`} passHref className="block group animate-slideInUp" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col">
                  <CardHeader className="p-0 relative h-48">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={`${category.name.toLowerCase()} fitness`}
                    />
                  </CardHeader>
                  <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{category.name}</CardTitle>
                      {category.description && (
                        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </CardDescription>
                      )}
                    </div>
                     <Button variant="link" className="mt-4 p-0 self-start text-primary group-hover:underline">
                        View {category.name} Plans <ArrowRight className="ml-1 h-4 w-4" />
                     </Button>
                  </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 md:py-16 bg-card rounded-lg shadow-md">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join FitDeed today to upload your own workouts, save your favorites, and take control of your fitness journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/workouts/upload">Upload a Plan</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
