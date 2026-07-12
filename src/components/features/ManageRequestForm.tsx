'use client';

import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { manageJoinRequestAction } from '@/app/(app)/trips/actions';
import { useRouter } from 'next/navigation';

export default function ManageRequestForm({ requestId, tripId }: { requestId: string; tripId: string }) {
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (approve: boolean) => {
    setError(null);
    if (approve) setLoadingApprove(true);
    else setLoadingReject(true);

    try {
      const res = await manageJoinRequestAction(requestId, approve);
      if (res?.error) {
        setError(res.error);
        alert(res.error);
      } else {
        router.refresh(); // reloads server components data
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      alert(err.message || 'An error occurred.');
    } finally {
      setLoadingApprove(false);
      setLoadingReject(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => handleAction(true)}
          disabled={loadingApprove || loadingReject}
          className="p-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors disabled:opacity-50"
          title="Approve Request"
        >
          {loadingApprove ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
        </button>
        <button
          onClick={() => handleAction(false)}
          disabled={loadingApprove || loadingReject}
          className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors disabled:opacity-50"
          title="Reject Request"
        >
          {loadingReject ? <Loader2 className="h-5 w-5 animate-spin" /> : <X className="h-5 w-5" />}
        </button>
      </div>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
