import { Skeleton } from '@/components/ui/skeleton';

export default function EditTripLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16" />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 pt-12 w-full space-y-6 animate-pulse">
        {/* Header link and title back */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-3.5 w-64 rounded-md" />
          </div>
        </div>

        {/* Form fields skeleton placeholders */}
        <div className="space-y-5 border border-slate-200 p-6 rounded-2xl">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>

          <Skeleton className="h-12 w-full rounded-xl mt-6" />
        </div>
      </main>
    </div>
  );
}
