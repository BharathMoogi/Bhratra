import { Skeleton } from '@/components/ui/skeleton';

export default function TripDetailsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16" />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-12 w-full space-y-8 animate-pulse">
        {/* Banner Details Card Skeleton */}
        <div className="border border-slate-200 bg-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-5 w-1/2 rounded" />
            </div>
            <Skeleton className="h-10 w-24 rounded-full shrink-0" />
          </div>

          {/* Parameters grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3.5 w-16 rounded" />
                <Skeleton className="h-5 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Sidebar Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>

            <hr className="border-slate-200" />

            {/* Travel Companions section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-44 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Card */}
          <div className="space-y-6">
            <div className="border border-slate-200 p-6 rounded-3xl space-y-4">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4.5 w-28 rounded" />
                  <Skeleton className="h-3.5 w-16 rounded" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
