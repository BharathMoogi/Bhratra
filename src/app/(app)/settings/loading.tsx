import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16" />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 pt-12 w-full space-y-6 animate-pulse">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-4.5 w-64 rounded-md" />
        </div>

        {/* Options list skeleton */}
        <div className="bg-white border border-slate-200/60 rounded-3xl divide-y divide-slate-100">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4.5 w-36 rounded" />
                <Skeleton className="h-3.5 w-full rounded" />
              </div>
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
            </div>
          ))}
        </div>

        {/* Preferences block skeleton */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-5">
          <Skeleton className="h-5 w-48 rounded" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-56 rounded" />
                </div>
                <Skeleton className="h-5 w-8 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
