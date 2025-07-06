'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { DietSuggestion, WorkoutSuggestion } from '@/ai/flows/generate-suggestions-flow';
import { Flame, Tag, Clock, BarChartBig } from 'lucide-react';

interface SuggestionCardProps {
  plan: (WorkoutSuggestion | DietSuggestion) & { planType: 'workout' | 'diet' };
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
  id: string;
}

export default function SuggestionCard({ plan, isSelected, onSelectionChange, id }: SuggestionCardProps) {
    const isWorkout = plan.planType === 'workout';
    const workoutPlan = isWorkout ? plan as WorkoutSuggestion : null;
    const dietPlan = !isWorkout ? plan as DietSuggestion : null;

    return (
        <Card className={cn("transition-all duration-300 relative", isSelected && "border-primary ring-2 ring-primary")}>
            <div className="absolute top-4 right-4 z-10">
                <Checkbox
                    id={`select-${id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectionChange(checked as boolean)}
                    aria-label="Select this plan"
                />
            </div>
            <Label htmlFor={`select-${id}`} className="cursor-pointer block">
                <CardHeader>
                    <CardTitle className="pr-10">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {plan.category && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Tag className="h-3 w-3" /> {plan.category}
                            </Badge>
                        )}
                        {isWorkout && workoutPlan?.duration && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {workoutPlan.duration}
                            </Badge>
                        )}
                        {isWorkout && workoutPlan?.difficulty && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <BarChartBig className="h-3 w-3" /> {workoutPlan.difficulty}
                            </Badge>
                        )}
                        {!isWorkout && dietPlan?.caloriesPerDay && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Flame className="h-3 w-3" /> {dietPlan.caloriesPerDay}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Label>
        </Card>
    );
}
