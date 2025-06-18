'use client';

import Link from 'next/link';
import { Dumbbell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/AuthButton';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/workouts', label: 'Workouts' },
  { href: '/workouts/upload', label: 'Upload Plan', protected: true },
  { href: '/favorites', label: 'Favorites', protected: true },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const accessibleNavItems = navItems.filter(item => !item.protected || (item.protected && user));

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Dumbbell className="h-8 w-8" />
          <span className="text-2xl font-headline font-semibold">FitDeed</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {accessibleNavItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link href={item.href} className="text-foreground hover:text-primary transition-colors">
                {item.label}
              </Link>
            </Button>
          ))}
          <AuthButton />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card p-6">
              <nav className="flex flex-col gap-4 mt-8">
                {accessibleNavItems.map((item) => (
                   <Button key={item.href} variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link href={item.href} className="text-foreground hover:text-primary transition-colors text-lg py-2">
                      {item.label}
                    </Link>
                  </Button>
                ))}
                <div className="mt-4">
                  <AuthButton onAction={() => setMobileMenuOpen(false)} />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
