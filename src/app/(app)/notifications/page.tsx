import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCachedUser } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Bell, BellOff, CheckCircle2, ChevronRight, MessageSquare, ShieldCheck, UserCheck } from 'lucide-react';

export default async function NotificationsPage() {
  // getCachedUser() — shared memoized lookup across all Server Components
  const user = await getCachedUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch notifications (read + unread) in a single query
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    include: {
      sender: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Mark unread notifications as read — fire in parallel with any remaining work
  if (notifications.some(n => !n.isRead)) {
    // Non-blocking: we already have the data, so this write can run without
    // holding up the render. Use void to intentionally not await here.
    void prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'TRIP_REQUEST':    return <UserCheck className="h-5 w-5 text-amber-500" />;
      case 'TRIP_ACCEPT':     return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'CHAT_MESSAGE':    return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'REVIEW_RECEIVED': return <ShieldCheck className="h-5 w-5 text-purple-500" />;
      default:                return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 pt-28 w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" /> Notifications
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with join requests, chat messages, and alerts.</p>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="p-4 bg-slate-100 text-slate-400 rounded-full w-fit mx-auto">
              <BellOff className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Notifications</h3>
            <p className="text-sm text-slate-500">
              You are all caught up! When other travelers interact with your trips or message you, they&apos;ll show up here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100">
            {notifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  className={`p-5 flex items-start gap-4 transition-colors ${
                    !notif.isRead ? 'bg-blue-50/20' : 'hover:bg-slate-50/40'
                  }`}
                >
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{notif.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                        {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.content}</p>
                    {notif.link && (
                      <div className="pt-2">
                        <Link href={notif.link} className="inline-flex items-center gap-1 text-xs font-bold text-mountain-blue hover:underline">
                          View details <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
