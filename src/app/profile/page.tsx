import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProfileForm from '@/components/features/ProfileForm';
import { signOutAction } from '@/app/auth/actions';
import { LogOut, User } from 'lucide-react';
import { UserProfile } from '@/types';

export default async function ProfilePage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
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
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    deletedAt: profile.deletedAt ? profile.deletedAt.toISOString() : null,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-6">
        
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

        {/* Render Profile Editor Form */}
        <ProfileForm initialProfile={profileProps} />
        
      </main>
      <Footer />
    </div>
  );
}
