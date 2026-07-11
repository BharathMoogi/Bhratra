import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import TravelerTrustCard from '@/components/features/TravelerTrustCard';
import SubmitReviewForm from '@/components/features/SubmitReviewForm';
import { getTravelerTrustProfileAction } from '../reviews/actions';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default async function TravelerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: travelerId } = await params;

  // 1. Fetch trust stats, profile details, and review logs
  const res = await getTravelerTrustProfileAction(travelerId);

  if (res.error || !res.profile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Traveler Not Found</h2>
          <p className="text-muted-foreground">The traveler profile details you requested do not exist.</p>
          <Link href="/trips" className="text-primary font-semibold hover:underline">Return to Explore</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Fetch authenticated user context to calculate review eligibility
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  let eligibleTripsForReview: any[] = [];

  if (currentUserId && currentUserId !== travelerId) {
    // Fetch all completed/ended trips where both users were accepted members
    const sharedTrips = await prisma.trip.findMany({
      where: {
        deletedAt: null,
        OR: [
          { status: 'COMPLETED' },
          { endDate: { lte: new Date() } },
        ],
        members: {
          some: { userId: currentUserId },
        },
      },
      include: {
        members: true,
      },
    });

    const sharedCompletedTrips = sharedTrips.filter((trip) =>
      trip.members.some((member) => member.userId === travelerId)
    );

    // Filter to trips that have NOT been reviewed yet by the current user
    for (const trip of sharedCompletedTrips) {
      const reviewExists = await prisma.review.findFirst({
        where: {
          reviewerId: currentUserId,
          revieweeId: travelerId,
          tripId: trip.id,
        },
      });
      if (!reviewExists) {
        eligibleTripsForReview.push(trip);
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        
        {/* Header link back */}
        <div className="flex items-center gap-3 pb-2 border-b border-border">
          <Link href="/trips" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Traveler Trust Profile</h1>
            <p className="text-xs text-muted-foreground">Verify travel reputation, completed trips, and companion feedback.</p>
          </div>
        </div>

        {/* Layout grid splitting trust card and review form if eligible */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Trust Card stats */}
          <div className="lg:col-span-2 space-y-6">
            <TravelerTrustCard
              profile={res.profile}
              email={res.email || ''}
              completedTripsCount={res.completedTripsCount || 0}
              avgRating={res.avgRating || 0.0}
              trustScore={res.trustScore || 0}
              reviews={res.reviews || []}
            />
          </div>

          {/* Submission panel sidebar */}
          {eligibleTripsForReview.length > 0 && (
            <div className="space-y-6">
              <SubmitReviewForm
                revieweeId={travelerId}
                revieweeName={res.profile.fullName || 'Traveler'}
                eligibleTrips={eligibleTripsForReview}
              />
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
