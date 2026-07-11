'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, Compass, PlusCircle, ShieldCheck, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                Bhratra
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/trips" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Compass className="h-4 w-4" />
              Explore Trips
            </Link>
            <Link href="/trips/create" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <PlusCircle className="h-4 w-4" />
              Create Trip
            </Link>
            <Link href="/verifications" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <ShieldCheck className="h-4 w-4" />
              Get Verified
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-secondary"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background animate-in slide-in-from-top duration-200">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <Link
              href="/trips"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Compass className="h-5 w-5" />
              Explore Trips
            </Link>
            <Link
              href="/trips/create"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Create Trip
            </Link>
            <Link
              href="/verifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ShieldCheck className="h-5 w-5" />
              Get Verified
            </Link>
            <hr className="my-2 border-border" />
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <User className="h-5 w-5" />
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-full text-base font-medium shadow-sm transition-all duration-200 mt-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
