
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useDietPlans } from '@/hooks/useDietPlans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Flame, Tag, Heart, Utensils, Loader2 } from 'lucide-react';
import type { DietPlan } from '@/types';
import { cn } from '@/lib/utils';

export default function DietPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getDietPlanById, toggleFavorite, favoritePlanIds, loading: dietPlansLoading } = useDietPlans();
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id && !dietPlansLoading) {
      const foundPlan = getDietPlanById(id);
      setPlan(foundPlan || null);
      setLoading(false);
    }
  }, [id, getDietPlanById, dietPlansLoading]);
  
  if (loading || dietPlansLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Diet Plan Not Found</h1>
        <p className="text-muted-foreground mb-6">The diet plan you are looking for does not exist or may have been removed.</p>
        <Button onClick={() => router.push('/diet-plans')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Diet Plans
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
              data-ai-hint="healthy food diet"
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
              {plan.caloriesPerDay && <Badge variant="outline" className="text-sm py-1 px-3"><Flame className="mr-1.5 h-4 w-4" />{plan.caloriesPerDay}</Badge>}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {plan.protein && <div className="p-4 bg-muted/30 rounded-lg"><p className="text-sm text-muted-foreground">Protein</p><p className="text-lg font-semibold">{plan.protein}</p></div>}
            {plan.carbs && <div className="p-4 bg-muted/30 rounded-lg"><p className="text-sm text-muted-foreground">Carbs</p><p className="text-lg font-semibold">{plan.carbs}</p></div>}
            {plan.fat && <div className="p-4 bg-muted/30 rounded-lg"><p className="text-sm text-muted-foreground">Fat</p><p className="text-lg font-semibold">{plan.fat}</p></div>}
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold font-headline flex items-center gap-2"><Utensils className="h-6 w-6 text-primary" /> Instructions</h3>
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
