import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCachedUser } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import TripMapClient from '@/components/features/TripMapClient';
import { AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TripMapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCachedUser();

  if (!user) {
    redirect(`/login?redirectTo=/trips/${id}/map`);
  }

  // Fetch Trip details along with members and map markers
  const trip = await prisma.trip.findFirst({
    where: { id, deletedAt: null },
    include: {
      owner: {
        include: {
          profile: true,
        },
      },
      members: {
        where: { deletedAt: null },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      mapMarkers: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!trip) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center p-4 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Trip Not Found</h2>
          <p className="text-muted-foreground text-sm">
            The trip map details you are looking for do not exist or have been deleted.
          </p>
          <Link href="/trips" className="text-primary font-semibold hover:underline">
            Return to Explore
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isOrganizer = user.id === trip.ownerId;
  
  // Format participants mapping safely
  const participants = trip.members.map((member: any) => ({
    id: member.id,
    role: member.role,
    latitude: member.latitude,
    longitude: member.longitude,
    shareLocation: member.shareLocation,
    user: {
      email: member.user.email,
      profile: member.user.profile
        ? {
            fullName: member.user.profile.fullName,
            avatarUrl: member.user.profile.avatarUrl,
            isVerified: member.user.profile.isVerified,
          }
        : null,
    },
  }));

  // Format custom markers safely
  const markers = trip.mapMarkers.map((marker) => ({
    id: marker.id,
    title: marker.title,
    description: marker.description,
    lat: marker.lat,
    lng: marker.lng,
    type: marker.type,
    createdById: marker.createdById,
  }));

  const clientTrip = {
    id: trip.id,
    title: trip.title,
    description: trip.description,
    startLocation: trip.startLocation,
    endLocation: trip.endLocation,
    startLat: trip.startLat,
    startLng: trip.startLng,
    endLat: trip.endLat,
    endLng: trip.endLng,
    routePath: trip.routePath,
    ownerId: trip.ownerId,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
              <Compass className="h-7 w-7 text-primary animate-pulse" /> Interactive Trip Map
            </h1>
            <p className="text-xs text-muted-foreground">
              Trace routes, share coordinates, organize meeting points, and check active participants.
            </p>
          </div>
          <Link
            href={`/trips/${trip.id}`}
            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors border border-border bg-card px-3.5 py-1.5 rounded-full shadow-sm"
          >
            ← View Details
          </Link>
        </div>

        <TripMapClient
          trip={clientTrip}
          participants={participants}
          markers={markers}
          currentUserId={user.id}
          isOrganizer={isOrganizer}
        />
      </main>
      <Footer />
    </div>
  );
}

// Inline simple icons to satisfy compiler
function Compass(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
