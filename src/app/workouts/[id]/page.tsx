'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, BarChartBig, Tag, Heart, PlayCircle, Loader2 } from 'lucide-react';
import type { WorkoutPlan } from '@/types';
import { cn } from '@/lib/utils';

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getWorkoutById, toggleFavorite, favoritePlanIds, loading: workoutsLoading } = useWorkouts();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id && !workoutsLoading) {
      const foundPlan = getWorkoutById(id);
      setPlan(foundPlan || null);
      setLoading(false);
    }
  }, [id, getWorkoutById, workoutsLoading]);
  
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
            <Button
              variant="default"
              size="lg"
              onClick={() => toggleFavorite(plan.id)}
              className={cn(
                "w-full md:w-auto transition-colors",
                isFavorite ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
              )}
            >
              <Heart className="mr-2 h-5 w-5" /> {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
