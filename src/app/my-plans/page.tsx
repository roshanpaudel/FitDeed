
'use client';

import WorkoutCard from '@/components/WorkoutCard';
import { useWorkouts } from '@/hooks/useWorkouts';
import ProtectedPage from '@/components/ProtectedPage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeartCrack } from 'lucide-react';
import type { WorkoutPlan } from '@/types';

function MyPlansPageContent() {
  const { getFavoriteWorkouts, loading } = useWorkouts();
  const favoriteWorkouts = getFavoriteWorkouts();

  if (loading) {
     return <div className="text-center py-12 text-muted-foreground">Loading My Plans...</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <h1 className="text-3xl font-bold font-headline mb-8">My Workout Plans</h1>
      {favoriteWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteWorkouts.map((plan: WorkoutPlan) => (
            <WorkoutCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow p-8">
          <HeartCrack className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground mb-4">You haven't saved any workout plans yet.</p>
          <Button asChild>
            <Link href="/workouts">Explore Workouts</Link>
          </Button>
        </div>
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
