import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import TripsListClient from '@/components/features/TripsListClient';
import { listTripsAction } from '@/app/(app)/trips/actions';

export const dynamic = 'force-dynamic';

/**
 * Trips page — Server Component shell.
 *
 * Fetches the first page of trips server-side so the initial render
 * always shows real content — no blank screen → spinner waterfall.
 * All interactive filtering and pagination is handled by TripsListClient.
 */
export default async function TripsPage() {
  // Fetch first page with default sort on the server
  const result = await listTripsAction({}, 1, 6, 'NEAREST');
  const initialTrips = (result?.trips ?? []) as any[];
  const initialTotalPages = result?.totalPages ?? 1;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 w-full">
        <TripsListClient
          initialTrips={initialTrips}
          initialTotalPages={initialTotalPages}
        />
      </main>
      <Footer />
    </div>
  );
}
