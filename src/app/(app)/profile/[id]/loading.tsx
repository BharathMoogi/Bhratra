import { Skeleton } from '@/components/ui/skeleton';

export default function PublicProfileLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16" />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-12 w-full space-y-6 animate-pulse">
        {/* Header link and title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-6 w-36 rounded-lg" />
            <Skeleton className="h-3.5 w-56 rounded-md" />
          </div>
        </div>

        {/* Profile Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left panel traveler trust details */}
          <div className="md:col-span-1 border border-slate-200 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <hr className="border-slate-200" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Right panel traveler reviews and bio */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>

            <hr className="border-slate-200" />

            <div className="space-y-4">
              <Skeleton className="h-6 w-44 rounded-lg" />
              {[1, 2].map((i) => (
                <div key={i} className="border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
