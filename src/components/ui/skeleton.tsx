import { cn } from '@/lib/utils';

/**
 * Skeleton — shimmer placeholder for loading states.
 *
 * Usage:
 *   <Skeleton className="h-6 w-32 rounded-lg" />
 *   <Skeleton className="h-40 w-full rounded-2xl" />
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-700',
        className
      )}
    />
  );
}
