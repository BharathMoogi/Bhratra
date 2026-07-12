import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { 
  Compass, PlusCircle, MapPin, Calendar, ShieldCheck, 
  Star, Users, Bell, ChevronRight, Bike 
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [dbUser, recentTrips, myTrips] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    }),
    // Latest trips from community
    prisma.trip.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: {
        owner: { include: { profile: true } },
        members: true,
      },
    }),
    // Trips the user is a member of or owns
    prisma.trip.findMany({
      where: {
        deletedAt: null,
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } },
        ],
      },
      orderBy: { startDate: 'asc' },
      take: 3,
    }),
  ]);

  const profile = dbUser?.profile;
  const displayName = profile?.fullName || user.email?.split('@')[0] || 'Traveler';
  const isVerified = profile?.isVerified || false;

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24 w-full space-y-8">

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mountain-blue via-blue-600 to-sky-500 p-8 text-white shadow-lg shadow-blue-900/15">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-100">{greeting} 👋</p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {displayName}!
            </h1>
            <p className="text-blue-100/80 text-sm max-w-md">
              The road awaits. Discover new travel groups, post your own expedition, or check on your pending companions.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified Traveler
              </span>
            ) : (
              <Link
                href="/verifications"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Get Verified →
              </Link>
            )}
            <Link
              href="/trips/create"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-mountain-blue font-bold px-5 py-2.5 rounded-full text-sm shadow-md transition-colors"
            >
              <PlusCircle className="h-4 w-4" /> Post a Trip
            </Link>
          </div>
        </div>
        {/* Decorative compass icon */}
        <Compass className="absolute -right-8 -bottom-8 h-48 w-48 text-white/5 stroke-[0.5]" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: '/trips', icon: Compass, label: 'Explore Trips', color: 'bg-blue-50 text-mountain-blue' },
          { href: '/trips/create', icon: PlusCircle, label: 'Create Trip', color: 'bg-emerald-50 text-forest-green' },
          { href: '/profile', icon: Star, label: 'My Profile', color: 'bg-orange-50 text-sunset-orange' },
          { href: '/verifications', icon: ShieldCheck, label: 'Verification', color: 'bg-purple-50 text-purple-600' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center"
          >
            <div className={`p-3 rounded-xl ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Community Trips */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Discover Trips</h2>
            <Link href="/trips" className="text-xs font-semibold text-mountain-blue hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTrips.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-8 text-center text-sm text-slate-400 font-medium">
                No trips available yet. Be the first to post!
              </div>
            ) : recentTrips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="flex items-start gap-4 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="p-2.5 bg-blue-50 text-mountain-blue rounded-xl shrink-0">
                  <Bike className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{trip.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" /> {trip.startLocation} → {trip.endLocation}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Users className="h-3 w-3" /> {trip.members.length + 1}/{trip.maxCapacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </div>

        {/* My Trips Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">My Journeys</h2>
          {myTrips.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 text-center space-y-3">
              <Compass className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-400">No active trips yet.</p>
              <Link
                href="/trips/create"
                className="inline-flex items-center gap-1.5 bg-mountain-blue text-white text-xs font-bold px-4 py-2 rounded-full transition-colors hover:bg-blue-700"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Plan a Trip
              </Link>
            </div>
          ) : myTrips.map((trip) => (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="block bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-2"
            >
              <h3 className="font-bold text-sm text-slate-900 truncate">{trip.title}</h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {trip.endLocation}</span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-slate-400">
                <Calendar className="h-3 w-3" />
                {new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </Link>
          ))}
          {myTrips.length > 0 && (
            <Link href="/trips" className="text-xs font-semibold text-mountain-blue hover:underline flex items-center gap-0.5">
              View all my trips <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </main>
      <Footer />
    </div>
  );
}
