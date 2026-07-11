'use client';

import React from 'react';
import { Star, ShieldCheck, CheckCircle2, Milestone, Calendar } from 'lucide-react';

interface TravelerTrustCardProps {
  profile: any;
  email: string;
  completedTripsCount: number;
  avgRating: number;
  trustScore: number;
  reviews: any[];
}

export default function TravelerTrustCard({
  profile,
  email,
  completedTripsCount,
  avgRating,
  trustScore,
  reviews,
}: TravelerTrustCardProps) {
  
  // Resolve trust score coloration classes
  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 50) return 'text-amber-500 stroke-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-500 stroke-rose-500 border-rose-500/20 bg-rose-500/5';
  };

  const getTrustLabel = (score: number) => {
    if (score >= 90) return 'Exceptional Companion';
    if (score >= 80) return 'Highly Trusted';
    if (score >= 60) return 'Verified Traveler';
    if (score >= 40) return 'Active Companion';
    return 'Provisional Profile';
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Header Banner & Trust Dial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-2 border border-border bg-card p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center font-bold text-lg flex-none">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.fullName?.charAt(0) || email.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-bold">{profile.fullName || 'Traveler'}</h2>
                {profile.isVerified && (
                  <span title="Identity Verified">
                    <ShieldCheck className="h-5.5 w-5.5 text-primary fill-primary/10" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
              
              <div className="flex gap-2 mt-3">
                {profile.gender && (
                  <span className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded border border-border capitalize">
                    {profile.gender.toLowerCase()}
                  </span>
                )}
                {profile.interests?.slice(0, 3).map((item: string, idx: number) => (
                  <span key={idx} className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded border border-border">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {profile.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed italic border-t border-border/60 pt-3">
              "{profile.bio}"
            </p>
          )}
        </div>

        {/* Trust Score Dial Card */}
        <div className={`border border-border p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center ${getTrustColor(trustScore)}`}>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Trust Score</span>
          
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Circular dial background */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-border/40 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-current fill-none transition-all duration-500"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * trustScore) / 100}
              />
            </svg>
            <span className="text-2xl font-extrabold text-foreground">{trustScore}%</span>
          </div>

          <span className="text-sm font-bold text-foreground mt-3.5">{getTrustLabel(trustScore)}</span>
          <span className="text-[10px] text-muted-foreground mt-1 max-w-[150px] leading-snug">
            Computed from rating averages, verification, and completed travel logs.
          </span>
        </div>

      </div>

      {/* 2. Grid stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        
        {/* Completed trips */}
        <div className="border border-border bg-card p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Milestone className="h-3.5 w-3.5 text-primary" /> Completed Trips
          </span>
          <p className="text-2xl font-extrabold text-foreground">{completedTripsCount}</p>
        </div>

        {/* Average Rating stars */}
        <div className="border border-border bg-card p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-primary fill-primary/10" /> Average Rating
          </span>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-extrabold text-foreground">{avgRating.toFixed(1)}</p>
            <div className="flex items-center gap-0.5 text-amber-500 ml-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-muted/40'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Verification Card */}
        <div className="col-span-2 sm:col-span-1 border border-border bg-card p-5 rounded-2xl shadow-sm space-y-1 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-primary fill-primary/10" /> Verification Status
          </span>
          <p className={`text-sm font-bold flex items-center gap-1.5 mt-1.5 ${profile.isVerified ? 'text-primary' : 'text-muted-foreground'}`}>
            <CheckCircle2 className={`h-4.5 w-4.5 ${profile.isVerified ? 'text-primary fill-primary/10' : 'text-muted-foreground'}`} />
            {profile.isVerified ? 'ID Verified Badge' : 'Not Verified'}
          </p>
        </div>

      </div>

      {/* 3. Recent Reviews Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Recent Traveler Feedback</h3>

        {reviews.length === 0 ? (
          <div className="border border-dashed border-border bg-card p-10 rounded-2xl text-center text-muted-foreground">
            No feedback reviews have been published for this traveler yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-border bg-card p-6 rounded-2xl shadow-sm space-y-4">
                
                {/* Reviewer Header info */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-border flex items-center justify-center font-bold text-xs">
                      {review.reviewer?.profile?.avatarUrl ? (
                        <img src={review.reviewer.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        review.reviewer?.profile?.fullName?.charAt(0) || review.reviewer?.email.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold">
                          {review.reviewer?.profile?.fullName || 'Traveler'}
                        </span>
                        {review.reviewer?.profile?.isVerified && (
                          <ShieldCheck className="h-3.5 w-3.5 text-primary fill-primary/10" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Rating Value */}
                  <div className="flex items-center gap-0.5 text-amber-500 bg-amber-500/5 px-2.5 py-1 border border-amber-500/10 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-xs font-bold text-foreground">{review.ratingValue}</span>
                  </div>
                </div>

                {/* Categories break-down */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-secondary/30 p-3 rounded-xl border border-border/80 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {review.ratings?.map((r: any) => (
                    <div key={r.id} className="flex justify-between items-center gap-2">
                      <span>{r.category.replace('_', ' ')}</span>
                      <span className="text-foreground font-bold">{r.score}/5</span>
                    </div>
                  ))}
                </div>

                {review.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{review.comment}"
                  </p>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
