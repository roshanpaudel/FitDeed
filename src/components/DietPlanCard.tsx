
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Flame, Tag } from 'lucide-react';
import type { DietPlan } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDietPlans } from '@/hooks/useDietPlans';
import { cn } from '@/lib/utils';

interface DietPlanCardProps {
  plan: DietPlan;
}

export default function DietPlanCard({ plan }: DietPlanCardProps) {
  const { favoritePlanIds, toggleFavorite } = useDietPlans();
  const isFavorite = favoritePlanIds.includes(plan.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking favorite
    toggleFavorite(plan.id);
  };

  return (
    <Link href={`/diet-plans/${plan.id}`} passHref className="block group_ animate-fadeIn hover:shadow-xl transition-shadow duration-300 rounded-lg">
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:border-primary">
          <CardHeader className="p-0">
            <div className="relative w-full h-48 md:h-56">
              <Image
                src={plan.imageUrl}
                alt={plan.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="healthy food diet"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{plan.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                className="text-muted-foreground hover:text-destructive transition-colors rounded-full"
              >
                <Heart className={cn("h-6 w-6", isFavorite ? "fill-destructive text-destructive" : "text-gray-400")} />
              </Button>
            </div>
            <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">{plan.description}</CardDescription>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {plan.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {plan.category}
                </Badge>
              )}
              {plan.caloriesPerDay && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Flame className="h-3 w-3" /> {plan.caloriesPerDay}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              View Plan
            </Button>
          </CardFooter>
        </Card>
    </Link>
  );
}
