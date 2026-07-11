import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import {
  joinTripAction,
  cancelJoinRequestAction,
  deleteTripAction,
  manageJoinRequestAction,
} from '../actions';
import { MapPin, Calendar, Shield, Users, ShieldCheck, Car, Trash2, Edit, AlertCircle, Check, X, Clock } from 'lucide-react';

export default async function TripDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch Trip details along with members, requests, and owner profile
  const trip = await prisma.trip.findFirst({
    where: { id: id, deletedAt: null },
    include: {
      owner: {
        include: {
          profile: true,
        },
      },
      members: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      requests: {
        where: {
          status: 'PENDING',
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  });

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Trip Not Found</h2>
          <p className="text-muted-foreground">The trip details you are looking for does not exist or has been deleted.</p>
          <Link href="/trips" className="text-primary font-semibold hover:underline">Return to Explore</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Fetch authenticated user context
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isOwner = user?.id === trip.ownerId;
  const isMember = trip.members.some((m) => m.userId === user?.id);
  
  // Fetch pending request if user applied
  const userRequest = user
    ? await prisma.tripRequest.findUnique({
        where: {
          tripId_userId: {
            tripId: id,
            userId: user.id,
          },
        },
      })
    : null;

  const approvedMembersCount = trip.members.length; // Includes organizer
  const seatsRemaining = Math.max(0, trip.maxCapacity - approvedMembersCount);
  const isTripFull = seatsRemaining <= 0;

  // Form submit server action wrappers
  const handleJoin = async (formData: FormData) => {
    'use server';
    const message = formData.get('message') as string;
    await joinTripAction(id, message);
    redirect(`/trips/${id}`);
  };

  const handleCancel = async () => {
    'use server';
    await cancelJoinRequestAction(id);
    redirect(`/trips/${id}`);
  };

  const handleDelete = async () => {
    'use server';
    await deleteTripAction(id);
    redirect('/trips');
  };

  const handleApprove = async (formData: FormData) => {
    'use server';
    const requestId = formData.get('requestId') as string;
    await manageJoinRequestAction(requestId, true);
    redirect(`/trips/${id}`);
  };

  const handleReject = async (formData: FormData) => {
    'use server';
    const requestId = formData.get('requestId') as string;
    await manageJoinRequestAction(requestId, false);
    redirect(`/trips/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24 w-full space-y-8">
        
        {/* Banner details */}
        <div className="border border-border bg-card p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                {trip.type.replace('_', ' ')}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{trip.title}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-4.5 w-4.5 text-primary" />
                <span className="font-semibold text-foreground">{trip.startLocation}</span> to <span className="font-semibold text-foreground">{trip.endLocation}</span>
              </p>
            </div>

            {/* Owner action controls */}
            {isOwner && (
              <div className="flex gap-2">
                <Link
                  href={`/trips/${id}/edit`}
                  className="inline-flex items-center gap-1.5 border border-border bg-card hover:bg-secondary px-4 py-2 rounded-full text-xs font-semibold transition-colors"
                >
                  <Edit className="h-4 w-4 text-muted-foreground" /> Edit
                </Link>
                <form action={handleDelete}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 border border-destructive/20 hover:bg-destructive/10 text-destructive px-4 py-2 rounded-full text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Grid properties */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-secondary/35 rounded-2xl border border-border/80">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Start Date</span>
              <p className="text-sm font-bold flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">End Date</span>
              <p className="text-sm font-bold flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Budget Range</span>
              <p className="text-sm font-bold capitalize text-emerald-500">
                {trip.budgetRange.toLowerCase()} Cost
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Seats Status</span>
              <p className="text-sm font-bold">
                {approvedMembersCount} / {trip.maxCapacity} ({seatsRemaining} left)
              </p>
            </div>
          </div>

          {/* Expanded parameters */}
          <div className="flex flex-wrap gap-3">
            {trip.difficulty && (
              <span className="text-xs font-semibold px-3 py-1 bg-secondary border border-border rounded-full">
                Difficulty: {trip.difficulty}
              </span>
            )}
            {trip.vehicle && (
              <span className="text-xs font-semibold px-3 py-1 bg-secondary border border-border rounded-full flex items-center gap-1">
                <Car className="h-3.5 w-3.5" /> Vehicle: {trip.vehicle}
              </span>
            )}
            {trip.languages.length > 0 && (
              <span className="text-xs font-semibold px-3 py-1 bg-secondary border border-border rounded-full">
                Languages: {trip.languages.join(', ')}
              </span>
            )}
            <span className="text-xs font-semibold px-3 py-1 bg-secondary border border-border rounded-full">
              {trip.isVerifiedOnly ? 'Verified Only' : 'Open to all'}
            </span>
            <span className="text-xs font-semibold px-3 py-1 bg-secondary border border-border rounded-full capitalize">
              Gender Pref: {trip.genderPref.replace('_', ' ').toLowerCase()}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="font-bold text-lg">Itinerary / Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{trip.description}</p>
          </div>
        </div>

        {/* Layout split: Members list vs Application Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Members list (8cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-border bg-card p-6 rounded-3xl shadow-sm space-y-6">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Group Members ({approvedMembersCount})
              </h2>
              
              <div className="divide-y divide-border">
                {trip.members.map((member: any) => (
                  <div key={member.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border flex items-center justify-center font-bold text-sm">
                        {member.user?.profile?.avatarUrl ? (
                          <img src={member.user.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          member.user?.profile?.fullName?.charAt(0) || member.user?.email.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold">
                            {member.user?.profile?.fullName || 'Traveler'}
                          </span>
                          {member.user?.profile?.isVerified && (
                            <ShieldCheck className="h-4 w-4 text-primary fill-primary/10" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {member.role.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner only: Pending Join Requests */}
            {isOwner && (
              <div className="border border-border bg-card p-6 rounded-3xl shadow-sm space-y-6">
                <h2 className="font-bold text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> Pending Requests ({trip.requests.length})
                </h2>

                {trip.requests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending requests for this trip.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {trip.requests.map((req: any) => (
                      <div key={req.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border flex items-center justify-center font-bold text-sm">
                              {req.user?.profile?.avatarUrl ? (
                                <img src={req.user.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                req.user?.profile?.fullName?.charAt(0) || req.user?.email.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold">
                                  {req.user?.profile?.fullName || 'Traveler'}
                                </span>
                                {req.user?.profile?.isVerified && (
                                  <ShieldCheck className="h-4 w-4 text-primary fill-primary/10" />
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Rating: {req.user?.profile?.rating || 'No ratings'}
                              </span>
                            </div>
                          </div>

                          {/* Action controls */}
                          <div className="flex gap-2">
                            <form action={handleApprove}>
                              <input type="hidden" name="requestId" value={req.id} />
                              <button
                                type="submit"
                                className="p-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                                title="Approve Request"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                            </form>
                            <form action={handleReject}>
                              <input type="hidden" name="requestId" value={req.id} />
                              <button
                                type="submit"
                                className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                                title="Reject Request"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </form>
                          </div>
                        </div>

                        {req.message && (
                          <div className="bg-secondary/40 p-3 rounded-xl border border-border text-xs text-muted-foreground italic">
                            "{req.message}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel: Application Actions (4cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Realtime Group Chat Link (For approved members and owner) */}
            {(isOwner || isMember) && (
              <div className="border border-border bg-card p-6 rounded-3xl shadow-sm space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trip Coordination</h3>
                <p className="text-xs text-muted-foreground">
                  Coordinate routes, stops, and schedules in the realtime group chat.
                </p>
                <Link
                  href={`/trips/${id}/chat`}
                  className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  Open Group Chat
                </Link>
              </div>
            )}
            
            {/* Trip Organizer Info card */}
            <div className="border border-border bg-card p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Organizer</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden border border-border flex items-center justify-center font-bold text-sm">
                  {trip.owner?.profile?.avatarUrl ? (
                    <img src={trip.owner.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    trip.owner?.profile?.fullName?.charAt(0) || trip.owner?.email.charAt(0)
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold">
                      {trip.owner?.profile?.fullName || 'Traveler'}
                    </span>
                    {trip.owner?.profile?.isVerified && (
                      <ShieldCheck className="h-4 w-4 text-primary fill-primary/10" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{trip.owner?.email}</p>
                </div>
              </div>
              
              {trip.owner?.profile?.bio && (
                <p className="text-xs text-muted-foreground italic line-clamp-3">
                  "{trip.owner.profile.bio}"
                </p>
              )}
            </div>

            {/* Application actions block */}
            {!isOwner && (
              <div className="border border-border bg-card p-6 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Status</h3>
                
                {isMember ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> You are an accepted companion.
                    </div>
                    <form action={handleCancel}>
                      <button
                        type="submit"
                        className="w-full border border-destructive/20 hover:bg-destructive/10 text-destructive py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Leave Trip Group
                      </button>
                    </form>
                  </div>
                ) : userRequest ? (
                  <div className="space-y-4">
                    <div className={`p-3 border rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                      userRequest.status === 'PENDING'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      <Clock className="h-4 w-4" /> 
                      {userRequest.status === 'PENDING' 
                        ? 'Application pending approval.' 
                        : 'Application declined.'}
                    </div>
                    <form action={handleCancel}>
                      <button
                        type="submit"
                        className="w-full border border-border hover:bg-secondary py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        {userRequest.status === 'PENDING' ? 'Cancel Application' : 'Clear Request'}
                      </button>
                    </form>
                  </div>
                ) : isTripFull ? (
                  <button
                    disabled
                    className="w-full bg-secondary text-muted-foreground py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
                  >
                    Trip Group is Full
                  </button>
                ) : (
                  <form action={handleJoin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message to Organizer</label>
                      <textarea
                        name="message"
                        rows={3}
                        placeholder="Say hello, share your driving/hiking experience..."
                        className="w-full bg-background border border-border rounded-xl p-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                    >
                      Apply to Join Trip
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
