import { Skeleton } from '@/components/ui/skeleton';

export default function MessagesLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16" />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 pt-12 w-full space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
                <Skeleton className="h-5 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-full rounded" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              </div>
              <Skeleton className="h-10 w-32 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
