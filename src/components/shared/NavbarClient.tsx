'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, LogOut, User, PlusCircle } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { signOutAction } from '@/app/auth/actions';
import type { User as SupabaseUser, SupabaseClient } from '@supabase/supabase-js';

export default function NavbarClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  // Get auth state from browser Supabase client
  useEffect(() => {
    const supabase: SupabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then((res: { data: { user: SupabaseUser | null } }) => {
      setUser(res.data.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setIsProfileMenuOpen(false);
    if (isProfileMenuOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Discover Trips', href: '/trips' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Safety', href: '/#safety' },
    { label: 'Community', href: '/#community' },
  ];

  const navBg = isLandingPage
    ? isScrolled
      ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm py-3'
      : 'bg-transparent py-5'
    : 'bg-white border-b border-gray-100 py-3 shadow-sm';

  const linkColor = (href: string) => {
    const isActive = pathname === href;
    if (isLandingPage && !isScrolled) {
      return isActive ? 'text-white font-extrabold' : 'text-blue-100 hover:text-white font-semibold';
    }
    return isActive ? 'text-mountain-blue font-extrabold' : 'text-slate-600 hover:text-mountain-blue font-semibold';
  };

  const isLoggedIn = !!user;
  const userName: string | null = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null;
  const userAvatar: string | null = user?.user_metadata?.avatar_url ?? null;
  const initials = userName
    ? userName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Bhratra Logo" 
            className="h-12 w-auto object-contain mix-blend-multiply"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm transition-colors ${linkColor(link.href)}`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/trips/create"
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  isLandingPage && !isScrolled ? 'text-blue-100 hover:text-white' : 'text-slate-600 hover:text-mountain-blue'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                Post a Trip
              </Link>

              {/* Avatar dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsProfileMenuOpen(!isProfileMenuOpen); }}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 pl-1 pr-3 py-1 shadow-sm transition-colors"
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName ?? 'User'} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-mountain-blue text-white flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                    {userName ?? user?.email}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-[20px] shadow-xl py-1.5 z-50">
                    <Link href="/profile" onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition-colors">
                      <User className="h-4 w-4 text-slate-400" /> My Profile
                    </Link>
                    <Link href="/trips" onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition-colors">
                      <Compass className="h-4 w-4 text-slate-400" /> My Trips
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => signOutAction()}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login"
                className={`text-sm font-semibold px-3 py-1.5 transition-colors ${
                  isLandingPage && !isScrolled ? 'text-blue-100 hover:text-white' : 'text-slate-600 hover:text-mountain-blue'
                }`}
              >
                Sign In
              </Link>
              <Link href="/signup"
                className="bg-mountain-blue hover:bg-blue-750 text-white text-sm font-bold px-5 py-2.5 rounded-[16px] shadow-md shadow-blue-900/10 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex md:hidden p-2 transition-colors ${
            isLandingPage && !isScrolled ? 'text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base transition-colors ${linkColor(link.href)}`}>
                {link.label}
              </Link>
            ))}
          </div>
          <hr className="border-gray-100" />
          {isLoggedIn ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 py-1">
                <div className="w-8 h-8 rounded-full bg-mountain-blue text-white flex items-center justify-center text-xs font-bold">{initials}</div>
                <span className="text-sm font-semibold text-slate-700 truncate">{userName ?? user?.email}</span>
              </div>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-600">
                <User className="h-4 w-4" /> My Profile
              </Link>
              <Link href="/trips/create" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-600">
                <PlusCircle className="h-4 w-4" /> Post a Trip
              </Link>
              <button onClick={() => signOutAction()} className="flex items-center gap-2 py-2 text-sm font-semibold text-red-500">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
               <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center font-bold text-slate-600 border border-gray-200 py-2.5 rounded-xl">Sign In</Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center font-bold bg-mountain-blue text-white py-2.5 rounded-[16px]">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
