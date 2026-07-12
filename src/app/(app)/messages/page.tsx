import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCachedUser } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { MessageSquare, ArrowRight, Calendar, Users, MapPin } from 'lucide-react';

export default async function MessagesOverviewPage() {
  // getCachedUser() — shared memoized lookup across all Server Components
  const user = await getCachedUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all trips the user is part of (as member or owner)
  const myTrips = await prisma.trip.findMany({
    where: {
      deletedAt: null,
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    },
    include: {
      owner: { include: { profile: true } },
      members: { include: { user: { include: { profile: true } } } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { startDate: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 pt-28 w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" /> Messages
          </h1>
          <p className="text-muted-foreground mt-1">Coordinate with your travel group companion circles.</p>
        </div>

        {myTrips.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="p-4 bg-slate-100 text-slate-400 rounded-full w-fit mx-auto">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Chat Rooms Yet</h3>
            <p className="text-sm text-slate-500">
              Join or create a trip to start chatting with your travel companions.
            </p>
            <Link href="/trips" className="bg-mountain-blue hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-colors">
              Browse Trips
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100">
            {myTrips.map((trip) => {
              const lastMessage = trip.messages[0];
              const participantCount = trip.members.length + 1; // Members + Owner
              return (
                <div key={trip.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold bg-blue-50 text-mountain-blue px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {trip.type.replace('_', ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                        <Users className="h-3 w-3" /> {participantCount} travelers
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-800 truncate">{trip.title}</h3>
                    {lastMessage ? (
                      <p className="text-sm text-slate-500 italic truncate max-w-xl">&quot;{lastMessage.content}&quot;</p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No messages sent yet. Start the conversation!</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-0.5"><MapPin className="h-3.5 w-3.5" /> {trip.endLocation}</span>
                      <span className="flex items-center gap-0.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-center gap-2">
                    <Link
                      href={`/trips/${trip.id}/chat`}
                      className="inline-flex items-center gap-2 bg-mountain-blue hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-md shadow-blue-100 transition-colors w-full sm:w-auto justify-center"
                    >
                      Open Chat <ArrowRight className="h-4.5 w-4.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
