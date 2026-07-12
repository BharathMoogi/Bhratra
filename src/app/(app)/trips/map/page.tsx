import { getCachedUser } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import TripsExplorerMap from '@/components/features/TripsExplorerMap';
import { Compass } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GlobalExplorerMapPage() {
  const user = await getCachedUser();

  // Retrieve all active trips
  const trips = await prisma.trip.findMany({
    where: {
      deletedAt: null,
      status: { notIn: ['COMPLETED', 'CANCELLED'] },
    },
    include: {
      members: {
        where: { deletedAt: null },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Map trips to serializable interface format
  const explorerTrips = trips.map((trip) => ({
    id: trip.id,
    title: trip.title,
    type: trip.type,
    startLocation: trip.startLocation,
    endLocation: trip.endLocation,
    startDate: trip.startDate.toISOString(),
    budgetRange: trip.budgetRange,
    maxCapacity: trip.maxCapacity,
    vehicle: trip.vehicle,
    difficulty: trip.difficulty,
    startLat: trip.startLat,
    startLng: trip.startLng,
    membersCount: trip.members.length,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
              <Compass className="h-7 w-7 text-primary animate-pulse" /> Explorer Map
            </h1>
            <p className="text-xs text-muted-foreground">
              Search and explore active travel groups across regions and start points.
            </p>
          </div>
        </div>

        <TripsExplorerMap trips={explorerTrips} />
      </main>
      <Footer />
    </div>
  );
}
