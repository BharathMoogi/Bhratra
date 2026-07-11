import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTripChatContextAction } from './actions';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import TripChat from '@/components/features/TripChat';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default async function TripChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch chat room parameters, messages history, and access constraints
  const res = await getTripChatContextAction(id);

  if (res.error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {res.error}
          </p>
          <Link
            href={`/trips/${id}`}
            className="text-primary font-semibold hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4.5 w-4.5" /> Return to Trip Details
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 pt-24 w-full space-y-6">
        
        {/* Header link back */}
        <div className="flex items-center gap-3 pb-2">
          <Link href={`/trips/${id}`} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Trip Chat Room</h1>
            <p className="text-xs text-muted-foreground">Coordinate plans and route details with verified travel companions.</p>
          </div>
        </div>

        {/* Realtime Chat Window */}
        <TripChat
          tripId={id}
          initialMessages={res.messages || []}
          initialReadStates={res.readStates || []}
          currentUser={res.currentUser}
          tripTitle={res.tripTitle || 'Trip'}
        />
      </main>
      <Footer />
    </div>
  );
}
