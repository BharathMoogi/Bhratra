import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-8 w-full space-y-8">

        {/* Welcome banner skeleton */}
        <Skeleton className="h-40 w-full rounded-3xl" />

        {/* Quick Actions skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Community trips */}
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-36 rounded-lg" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          </div>

          {/* My trips sidebar */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-28 rounded-lg" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
