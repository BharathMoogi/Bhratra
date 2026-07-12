'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitReviewAction } from '@/app/(app)/profile/reviews/actions';
import { Star, Loader2 } from 'lucide-react';

interface SubmitReviewFormProps {
  revieweeId: string;
  revieweeName: string;
  eligibleTrips: any[];
}

export default function SubmitReviewForm({
  revieweeId,
  revieweeName,
  eligibleTrips,
}: SubmitReviewFormProps) {
  const router = useRouter();
  const [selectedTripId, setSelectedTripId] = useState(eligibleTrips[0]?.id || '');
  
  // Rating states (default to 5 stars)
  const [safety, setSafety] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [driving, setDriving] = useState(5);
  const [friendliness, setFriendliness] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [overall, setOverall] = useState(5);
  
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const categories = [
    { label: 'Safety Guidelines', value: safety, setter: setSafety },
    { label: 'Communication Ease', value: communication, setter: setCommunication },
    { label: 'Driving Skills', value: driving, setter: setDriving },
    { label: 'Friendliness & Attitude', value: friendliness, setter: setFriendliness },
    { label: 'Punctuality & Timeliness', value: punctuality, setter: setPunctuality },
    { label: 'Overall Experience', value: overall, setter: setOverall },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const ratingsPayload = {
      SAFETY: safety,
      COMMUNICATION: communication,
      DRIVING: driving,
      FRIENDLINESS: friendliness,
      PUNCTUALITY: punctuality,
      OVERALL_EXPERIENCE: overall,
    };

    const res = await submitReviewAction(
      revieweeId,
      selectedTripId,
      ratingsPayload,
      comment
    );

    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('Your feedback review has been submitted successfully!');
      setComment('');
      router.refresh();
    }
  };

  const StarSelector = ({ val, setVal }: { val: number; setVal: (n: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setVal(idx)}
            className="text-amber-500 hover:scale-110 transition-transform p-0.5"
          >
            <Star className={`h-5 w-5 ${idx <= val ? 'fill-current' : 'text-muted-foreground/30'}`} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="border border-border bg-card p-6 rounded-3xl shadow-sm space-y-6">
      <div>
        <h3 className="font-bold text-lg">Leave Companion Feedback</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Share your experience traveling with {revieweeName} to help verify trust metrics.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-xs text-destructive rounded-xl font-medium">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 rounded-xl font-medium">
          {successMsg}
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Select Trip */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Shared Trip</label>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none"
            >
              {eligibleTrips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title} (Ended: {new Date(trip.endDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Rating Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-border/80 py-4 my-2">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center bg-secondary/20 border border-border/60 p-2.5 rounded-xl">
                <span className="text-xs font-semibold text-foreground/80">{cat.label}</span>
                <StarSelector val={cat.value} setVal={cat.setter} />
              </div>
            ))}
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Review Comment</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a brief comment about safety, punctuality, or general group chemistry..."
              className="w-full bg-background border border-border rounded-xl p-3 text-xs placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Submitting Feedback...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
