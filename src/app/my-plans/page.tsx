
'use client';

import WorkoutCard from '@/components/WorkoutCard';
import DietPlanCard from '@/components/DietPlanCard';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useDietPlans } from '@/hooks/useDietPlans';
import ProtectedPage from '@/components/ProtectedPage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeartCrack, Utensils, Zap, Loader2 } from 'lucide-react';
import type { WorkoutPlan } from '@/types';
import type { DietPlan } from '@/types';

function MyPlansPageContent() {
  const { getFavoriteWorkouts, loading: workoutsLoading } = useWorkouts();
  const { getFavoriteDietPlans, loading: dietsLoading } = useDietPlans();
  
  const favoriteWorkouts = getFavoriteWorkouts();
  const favoriteDietPlans = getFavoriteDietPlans();

  const loading = workoutsLoading || dietsLoading;

  if (loading) {
     return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
     );
  }

  const noPlansSaved = favoriteWorkouts.length === 0 && favoriteDietPlans.length === 0;

  return (
    <div className="space-y-12 animate-fadeIn">
      {noPlansSaved ? (
          <div className="text-center py-20 bg-card rounded-lg shadow p-8">
            <HeartCrack className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-2xl text-muted-foreground mb-6">You haven't saved any plans yet.</p>
            <p className="text-lg text-muted-foreground mb-8">Start by exploring workouts and diet plans and add them to your favorites!</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Button asChild size="lg">
                    <Link href="/workouts">Explore Workouts</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/diet-plans">Explore Diets</Link>
                </Button>
            </div>
          </div>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold font-headline mb-6 flex items-center gap-3"><Zap className="h-8 w-8 text-primary"/> My Favorite Workout Plans</h1>
            {favoriteWorkouts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteWorkouts.map((plan: WorkoutPlan) => (
                  <WorkoutCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg shadow p-8">
                <p className="text-xl text-muted-foreground mb-4">You haven't saved any workout plans yet.</p>
                <Button asChild>
                  <Link href="/workouts">Explore Workouts</Link>
                </Button>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold font-headline mb-6 flex items-center gap-3"><Utensils className="h-8 w-8 text-primary"/> My Favorite Diet Plans</h1>
            {favoriteDietPlans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteDietPlans.map((plan: DietPlan) => (
                  <DietPlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg shadow p-8">
                <p className="text-xl text-muted-foreground mb-4">You haven't saved any diet plans yet.</p>
                <Button asChild>
                  <Link href="/diet-plans">Explore Diets</Link>
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function MyPlansPage() {
  return (
    <ProtectedPage>
      <MyPlansPageContent />
    </ProtectedPage>
  );
}
