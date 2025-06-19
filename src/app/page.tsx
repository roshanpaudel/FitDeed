'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWorkouts } from '@/hooks/useWorkouts';
import { ArrowRight, Zap } from 'lucide-react';
import type { Category } from '@/types';

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
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-lg shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary animate-slideInUp">
            Welcome to FitPlan!
          </h1>
          <p className="text-lg md:text-xl text-foreground mb-8 max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            Discover personalized workout plans, track your progress, and achieve your fitness goals.
            Start your journey to a healthier you today.
          </p>
          <Button size="lg" asChild className="animate-slideInUp" style={{ animationDelay: '0.4s' }}>
            <Link href="/workouts">
              Explore Workout Plans <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold font-headline mb-8 text-center">Workout Categories</h2>
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
            Join FitPlan today to upload your own workouts, save your favorites, and take control of your fitness journey.
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
