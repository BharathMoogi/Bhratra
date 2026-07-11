'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Compass } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Discover Trips', href: '/trips' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Safety', href: '#safety' },
    { label: 'Community', href: '#community' },
    { label: 'About', href: '#about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-xl text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-foreground">
            Bhratra
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-primary/10 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Actions Button */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border/80 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-semibold transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <hr className="border-border/50" />
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/auth/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center font-bold text-muted-foreground hover:text-foreground py-2.5 rounded-xl border border-border transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center font-bold bg-primary text-primary-foreground py-2.5 rounded-xl transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
