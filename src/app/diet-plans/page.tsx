'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DietPlanCard from '@/components/DietPlanCard'; // Assuming you will create this component
import { useDietPlans } from '@/hooks/useDietPlans'; // Assuming you will create this hook
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { ListFilter, Search, Loader2 } from 'lucide-react';
import type { DietPlan } from '@/types'; // Assuming you will define this type

function DietPlanListContent() {
  const { dietPlans, categories, loading } = useDietPlans();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDietPlans = useMemo(() => {
    return dietPlans.filter((plan: DietPlan) => { // Renamed variable and type
      const categoryMatch = selectedCategory === 'all' || plan.category.toLowerCase() === selectedCategory.toLowerCase();
      const searchTermMatch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              plan.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchTermMatch;
    });
  }, [dietPlans, selectedCategory, searchTerm]); // Renamed variable

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 bg-card rounded-lg shadow">
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search diet plans..." // Renamed placeholder
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
           <ListFilter className="h-5 w-5 text-muted-foreground md:hidden" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]" aria-label="Filter by category">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toLowerCase()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredDietPlans.length > 0 ? ( // Renamed variable
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDietPlans.map((plan: DietPlan) => ( // Renamed variable and type
            <DietPlanCard key={plan.id} plan={plan} /> // Renamed component
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No diet plans found matching your criteria.</p> {/* Renamed text */}
          {selectedCategory !== 'all' || searchTerm !== '' ? (
            <Button variant="link" onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}>
              Clear filters and search
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
export default function DietPlansPage() { // Renamed component
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-300px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <DietPlanListContent /> {/* Renamed component */}
    </Suspense>
  );
}