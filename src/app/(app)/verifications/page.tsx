import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { getCachedUser } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy-load VerificationClient — it's 15 KB and not needed until the page loads
const VerificationClient = dynamic(
  () => import('@/components/features/VerificationClient'),
  {
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    ),
  }
);

export default async function VerificationPage() {
  // getCachedUser() — shared memoized lookup, no extra auth round-trip
  const user = await getCachedUser();

  let initialProfile = null;
  if (user) {
    initialProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        isVerified: true,
        verificationDoc: true,
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 pt-24 w-full">
        <VerificationClient initialProfile={initialProfile} />
      </main>
      <Footer />
    </div>
  );
}
