'use client';

import Link from 'next/link';
import { LogIn, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface AuthButtonProps {
  onAction?: () => void; // Optional callback for mobile menu closing
}

export default function AuthButton({ onAction }: AuthButtonProps) {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <Button variant="outline" disabled>Loading...</Button>;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://placehold.co/100x100.png?text=${user.name ? user.name.charAt(0).toUpperCase() : 'U'}`} alt={user.name || 'User'} data-ai-hint="profile avatar" />
              <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { logout(); if (onAction) onAction(); }}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-2">
        <Button asChild variant="outline" onClick={onAction}>
            <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
        </Button>
        <Button asChild onClick={onAction}>
            <Link href="/signup">
                <UserCircle className="mr-2 h-4 w-4" /> Sign Up
            </Link>
        </Button>
    </div>
  );
}
