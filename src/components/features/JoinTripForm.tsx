'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { joinTripAction } from '@/app/trips/actions';
import { AlertCircle, Check, Loader2, ShieldCheck } from 'lucide-react';

interface JoinTripFormProps {
  tripId: string;
}

export default function JoinTripForm({ tripId }: JoinTripFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await joinTripAction(tripId, message);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setMessage('');
        // Refresh the page so organizer's pending requests updates too
        router.refresh();
      }
    });
  };

  if (success) {
    return (
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-600 font-semibold flex items-start gap-2">
        <Check className="h-4 w-4 mt-0.5 shrink-0" />
        <span>Application sent! The organizer will review your request shortly.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error banner */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 font-semibold space-y-2">
          <div className="flex items-start gap-1.5">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
          {error.toLowerCase().includes('verif') && (
            <Link
              href="/verifications"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Get Verified →
            </Link>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Message to Organizer
        </label>
        <textarea
          name="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say hello, share your driving/hiking experience..."
          className="w-full bg-background border border-border rounded-xl p-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending Application...
          </>
        ) : (
          'Apply to Join Trip'
        )}
      </button>
    </form>
  );
}
