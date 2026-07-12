import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16" />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 pt-12 w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <Skeleton className="h-8 w-52 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        {/* Journey progress banner */}
        <Skeleton className="h-24 w-full rounded-2xl" />

        {/* Form fields skeleton */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
          {/* Input rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
          <Skeleton className="h-10 w-full rounded-xl mt-4" />
        </div>
      </main>
    </div>
  );
}
