import { redirect } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getCachedUser } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { signOutAction } from '@/app/auth/actions';
import { LogOut, User } from 'lucide-react';
import { UserProfile } from '@/types';

// Lazy-load the 14 KB ProfileForm — defers this chunk until the component is needed
const ProfileForm = dynamic(
  () => import('@/components/features/ProfileForm'),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    ),
  }
);

export default async function ProfilePage() {
  // getCachedUser() is shared with Navbar — zero extra auth round-trips
  const user = await getCachedUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch traveler user and profile details from database
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  });

  // Lazy creation fallback
  if (!dbUser) {
    try {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          role: 'USER',
          status: 'ACTIVE',
        },
        include: { profile: true },
      });
    } catch (dbError) {
      console.error('Lazy User creation in page fallback failed:', dbError);
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <p className="text-destructive font-semibold">Failed to establish database context. Please try again.</p>
        </div>
      );
    }
  }

  let profile = dbUser.profile;

  if (!profile) {
    try {
      profile = await prisma.profile.create({
        data: {
          id: user.id,
          fullName: user.user_metadata?.full_name || null,
          avatarUrl: user.user_metadata?.avatar_url || null,
          isVerified: false,
        },
      });
    } catch (dbError) {
      console.error('Lazy Profile creation in page fallback failed:', dbError);
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <p className="text-destructive font-semibold">Failed to establish profile context. Please try again.</p>
        </div>
      );
    }
  }

  // Safely map dates and fields for the client component
  const profileProps: UserProfile = {
    id: profile.id,
    email: dbUser.email,
    fullName: profile.fullName,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    phoneNumber: profile.phoneNumber,
    gender: profile.gender,
    birthDate: profile.birthDate ? profile.birthDate.toISOString() : null,
    isVerified: profile.isVerified,
    role: dbUser.role,
    verificationDoc: profile.verificationDoc,
    rating: profile.rating,
    interests: profile.interests,
    languages: profile.languages,
    dietary: profile.dietary,
    smoking: profile.smoking,
    bikeType: profile.bikeType,
    ridingExperience: profile.ridingExperience,
    travelStyle: profile.travelStyle,
    budgetPref: profile.budgetPref,
    preferredDestinations: profile.preferredDestinations,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    deletedAt: profile.deletedAt ? profile.deletedAt.toISOString() : null,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 pt-28 w-full space-y-6">
        
        {/* Header section with Sign Out button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <User className="h-8 w-8 text-primary" /> Profile Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage traveler details and preferences.</p>
          </div>
          
          <form action={signOutAction} className="w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-destructive/20 text-destructive hover:bg-destructive/10 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-colors"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sign Out
            </button>
          </form>
        </div>

        {/* Journey Progress Flow Guides */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="space-y-1 text-center sm:text-left">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
              Journey Flow: Step 3 of 10
            </span>
            <h3 className="text-sm font-bold text-gray-800 mt-1">Configure your traveler profile details below</h3>
            <p className="text-xs text-gray-500">Once your profile is saved, you can create a trip or browse active trips to match with companions.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/trips/create"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-full shadow-md shadow-blue-100 transition-colors"
            >
              Create Trip
            </Link>
            <Link
              href="/trips"
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4.5 py-2.5 rounded-full border border-slate-200 shadow-sm transition-colors"
            >
              Browse Trips
            </Link>
          </div>
        </div>

        {/* Render Profile Editor Form */}
        <ProfileForm initialProfile={profileProps} />
        
      </main>
      <Footer />
    </div>
  );
}
