
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWorkouts } from '@/hooks/useWorkouts';
import { ArrowRight, Zap, Wand2, Loader2 } from 'lucide-react';
import type { Category } from '@/types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { generateSuggestions, type GenerateSuggestionsInput, type GenerateSuggestionsOutput, type DietSuggestion, type WorkoutSuggestion } from '@/ai/flows/generate-suggestions-flow';
import { useToast } from '@/hooks/use-toast';
import SuggestionCard from '@/components/SuggestionCard';
import { useDietPlans } from '@/hooks/useDietPlans';

// New component for the AI generation section
function AiGenerationSection() {
    const { toast } = useToast();
    const { addWorkoutPlan } = useWorkouts();
    const { addDietPlan } = useDietPlans();

    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<GenerateSuggestionsOutput | null>(null);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast({ title: "Prompt is empty", description: "Please enter a description for the plans you want.", variant: "destructive" });
            return;
        }
        setIsGenerating(true);
        setResults(null);
        setSelectedIndices([]);
        try {
            const input: GenerateSuggestionsInput = { prompt };
            const output = await generateSuggestions(input);
            setResults(output);
        } catch (error) {
            console.error("AI generation failed:", error);
            toast({ title: "AI Error", description: "Something went wrong while generating suggestions. Please try again.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectionChange = (index: number, isSelected: boolean) => {
        if (isSelected) {
            setSelectedIndices(prev => [...prev, index]);
        } else {
            setSelectedIndices(prev => prev.filter(i => i !== index));
        }
    };
    
    const handleAddSelected = async () => {
        if (!results || selectedIndices.length === 0) return;

        toast({ title: "Adding Plans...", description: `Adding ${selectedIndices.length} selected plans to your library.` });
        
        let plansToAdd: (WorkoutSuggestion | DietSuggestion)[] = [];
        if (results.planType === 'workout' && results.workouts) {
            plansToAdd = selectedIndices.map(i => results.workouts![i]);
        } else if (results.planType === 'diet' && results.diets) {
            plansToAdd = selectedIndices.map(i => results.diets![i]);
        }

        for (const plan of plansToAdd) {
            // The AI returns instructions as a single string, we need to split it
            const formattedInstructions = plan.instructions.split('\n').map(s => s.trim()).filter(s => s.length > 0);
            
            if (results.planType === 'workout') {
                await addWorkoutPlan({ ...(plan as WorkoutSuggestion), instructions: formattedInstructions });
            } else {
                await addDietPlan({ ...(plan as DietSuggestion), instructions: formattedInstructions });
            }
        }

        toast({ title: "Success!", description: `${selectedIndices.length} plans have been added. Find them in 'Workouts' or 'Diets'.`, variant: "default"});
        setSelectedIndices([]);
    };
    
    const suggestions = results && (results.planType === 'workout' ? results.workouts : results.diets);

    return (
        <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-lg shadow-lg">
            <div className="container mx-auto px-4">
                <Wand2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary animate-slideInUp">
                    Generate Your Perfect Plan
                </h1>
                <p className="text-lg md:text-xl text-foreground mb-8 max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                    Describe your ideal workout or diet, and let our AI create personalized suggestions for you.
                </p>
                <div className="max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                    <div className="flex gap-2">
                        <Input
                            id="ai-prompt-home"
                            placeholder="e.g., a 3-day strength training split for beginners"
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
                
                {suggestions && suggestions.length > 0 && (
                    <div className="mt-12 text-left animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suggestions.map((plan, index) => (
                                <SuggestionCard 
                                    key={index}
                                    id={`suggestion-${index}`}
                                    plan={{ ...plan, planType: results!.planType }}
                                    isSelected={selectedIndices.includes(index)}
                                    onSelectionChange={(isSelected) => handleSelectionChange(index, isSelected)}
                                />
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Button 
                                size="lg" 
                                onClick={handleAddSelected}
                                disabled={selectedIndices.length === 0}
                            >
                                Add {selectedIndices.length} Selected Plan{selectedIndices.length === 1 ? '' : 's'}
                            </Button>
                        </div>
                    </div>
                )}

                 {results && (!suggestions || suggestions.length === 0) && !isGenerating && (
                    <div className="mt-12 text-center text-muted-foreground">
                        <p>The AI could not generate suggestions for your prompt. Please try being more specific.</p>
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
