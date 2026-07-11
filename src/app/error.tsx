'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Something went wrong!</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        We encountered an unexpected runtime error. Please try again or return to the main dashboard.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-border hover:bg-secondary text-foreground px-4 py-2 rounded-xl text-xs font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
