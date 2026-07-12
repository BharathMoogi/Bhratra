import { Skeleton } from '@/components/ui/skeleton';

export default function TripsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16" />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8 w-full">

        {/* Title bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 rounded-xl" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Filter sidebar skeleton */}
          <div className="hidden lg:block space-y-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl h-fit">
            <Skeleton className="h-6 w-24 rounded" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            ))}
            <Skeleton className="h-10 w-full rounded-xl mt-2" />
          </div>

          {/* Trip cards skeleton */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-4 w-2/5 rounded" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-5 w-14 rounded" />
                  <Skeleton className="h-5 w-14 rounded" />
                  <Skeleton className="h-5 w-20 rounded" />
                </div>
                <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                  <Skeleton className="h-7 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
