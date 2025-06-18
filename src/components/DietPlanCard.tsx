'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DietPlanCardProps {
  plan: {
    id: string; // Assuming an ID for the plan
    name: string;
    description: string;
    // Add other properties if needed
  };
}

const DietPlanCard: React.FC<DietPlanCardProps> = ({ plan }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{plan.description || 'No description provided.'}</p>
        {/* You can add more diet plan details here */}
      </CardContent>
    </Card>
  );
};

export default DietPlanCard;