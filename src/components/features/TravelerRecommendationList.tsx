'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, UserPlus, Check, MessageSquare, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TravelerRecommendation {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  rating: number;
  interests: string[];
  languages: string[];
  bikeType: string | null;
  ridingExperience: string | null;
  travelStyle: string | null;
  compatibility: {
    score: number;
    reasons: string[];
  };
}

interface TravelerRecommendationListProps {
  travelers: TravelerRecommendation[];
  tripId: string;
}

export default function TravelerRecommendationList({ travelers, tripId }: TravelerRecommendationListProps) {
  // Store dynamic invitation statuses by traveler ID
  const [invitedIds, setInvitedIds] = useState<Record<string, boolean>>({});
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  const handleInvite = async (travelerId: string) => {
    setLoadingIds(prev => ({ ...prev, [travelerId]: true }));
    
    // Simulate API request to trigger companion invitation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLoadingIds(prev => ({ ...prev, [travelerId]: false }));
    setInvitedIds(prev => ({ ...prev, [travelerId]: true }));
  };

  if (travelers.length === 0) {
    return (
      <div className="border border-dashed border-border bg-card p-8 rounded-2xl text-center space-y-3">
        <Compass className="h-10 w-10 text-muted-foreground mx-auto stroke-[1.5]" />
        <h4 className="font-bold text-sm text-foreground">No Matching Travelers</h4>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Currently, no other travelers match your trip criteria. Try expanding your trip tags or options!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">AI Companion Matches</h2>
          <p className="text-xs text-muted-foreground">Top matching travelers based on riding profile, style, and interests.</p>
        </div>
        <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          AI Recommendations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {travelers.map((traveler) => {
          const isInvited = invitedIds[traveler.id];
          const isLoading = loadingIds[traveler.id];
          const score = traveler.compatibility.score;

          return (
            <div
              key={traveler.id}
              className="border border-border bg-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: User avatar, rating, and compatibility score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center relative flex-shrink-0">
                      {traveler.avatarUrl ? (
                        <Image
                          src={traveler.avatarUrl}
                          alt={traveler.fullName || 'Traveler'}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      ) : (
                        <span className="font-bold text-sm text-muted-foreground">
                          {traveler.fullName?.charAt(0) || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1">
                        {traveler.fullName || 'Traveler'}
                        <ShieldCheck className="h-4 w-4 text-primary fill-primary/10 flex-shrink-0" />
                      </h4>
                      {traveler.rating > 0 ? (
                        <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold mt-0.5">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{traveler.rating.toFixed(1)} Rating</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-semibold">New Traveler</span>
                      )}
                    </div>
                  </div>

                  {/* Compatibility Circle Match */}
                  <div className={`px-2.5 py-1 rounded-full border text-xs font-black flex items-center gap-1 shadow-sm ${
                    score >= 80
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : score >= 50
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {score}% Match
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="mt-3.5 p-2.5 bg-secondary/35 rounded-xl border border-border/50 text-[10px] font-bold text-muted-foreground space-y-1">
                  {traveler.compatibility.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                      <span className="w-1 h-1 bg-primary rounded-full shrink-0" />
                      {reason}
                    </div>
                  ))}
                </div>

                {/* Companion attributes */}
                <div className="mt-3.5 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] text-muted-foreground">
                  <div>
                    <span className="font-semibold block text-slate-400">Riding Experience</span>
                    <span className="font-bold text-slate-700">{traveler.ridingExperience || 'Not configured'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-400">Preferred Bike Type</span>
                    <span className="font-bold text-slate-700">{traveler.bikeType || 'None'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-400">Travel Style Vibe</span>
                    <span className="font-bold text-slate-700">{traveler.travelStyle || 'Flexible'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-400">Interests Overlap</span>
                    <span className="font-bold text-slate-700 truncate max-w-[120px]">
                      {traveler.interests.length > 0 ? traveler.interests.slice(0, 2).join(', ') : 'Flexible'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-border flex items-center gap-2">
                <Link
                  href={`/profile/${traveler.id}`}
                  className="flex-1 text-center border border-border bg-card hover:bg-secondary text-slate-700 font-bold py-2 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-1"
                >
                  View Profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => handleInvite(traveler.id)}
                  disabled={isInvited || isLoading}
                  className={`flex-1 font-bold py-2 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm ${
                    isInvited
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50'
                  }`}
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : isInvited ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Invited
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5" /> Invite Traveler
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
