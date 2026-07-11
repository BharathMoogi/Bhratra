import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import EditTripForm from '@/components/features/EditTripForm';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Trip } from '@/types';

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  // Fetch the trip details from database
  const trip = await prisma.trip.findFirst({
    where: { id: id, deletedAt: null },
  });

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Trip Not Found</h2>
          <p className="text-muted-foreground">The trip you want to edit does not exist or has been deleted.</p>
          <Link href="/trips" className="text-primary font-semibold hover:underline">Return to Explore</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Access check: only organizer can modify
  if (trip.ownerId !== user.id) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">Only the trip organizer can edit these details.</p>
          <Link href={`/trips/${id}`} className="text-primary font-semibold hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to details
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Map dates and schema parameters for the form props
  const tripProps: Trip = {
    id: trip.id,
    title: trip.title,
    description: trip.description,
    type: trip.type as any,
    startLocation: trip.startLocation,
    endLocation: trip.endLocation,
    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),
    budgetRange: trip.budgetRange as any,
    maxCapacity: trip.maxCapacity,
    isVerifiedOnly: trip.isVerifiedOnly,
    genderPref: trip.genderPref as any,
    vehicle: trip.vehicle,
    difficulty: trip.difficulty as any,
    languages: trip.languages,
    status: trip.status as any,
    ownerId: trip.ownerId,
    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
    deletedAt: trip.deletedAt ? trip.deletedAt.toISOString() : null,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 pt-24 w-full space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Link href={`/trips/${id}`} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Trip Details</h1>
            <p className="text-xs text-muted-foreground">Modify journey settings and companion guidelines.</p>
          </div>
        </div>

        <EditTripForm trip={tripProps} />
      </main>
      <Footer />
    </div>
  );
}
