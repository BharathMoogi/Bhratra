import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCachedUser } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Settings, User, ShieldAlert, Bell, ChevronRight, Lock } from 'lucide-react';

export default async function SettingsPage() {
  const user = await getCachedUser();

  if (!user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  });

  const profile = dbUser?.profile;
  const isVerified = profile?.isVerified || false;

  const settingsOptions = [
    {
      title: 'Profile Settings',
      description: 'Update your profile bio, birthdate, vehicle type, and dietary preferences.',
      href: '/profile',
      icon: User,
      badge: null,
    },
    {
      title: 'Identity Verification',
      description: 'Submit your Passport or DL to acquire a trust badge and apply to verified-only groups.',
      href: '/verifications',
      icon: ShieldAlert,
      badge: isVerified ? 'Verified' : 'Action Required',
      badgeColor: isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 pt-28 w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" /> Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account settings, verification, and privacy options.</p>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {settingsOptions.map((option, idx) => (
            <Link 
              key={idx}
              href={option.href}
              className="p-6 hover:bg-slate-50/50 transition-colors flex items-start gap-4"
            >
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl shrink-0 text-slate-500 mt-0.5">
                <option.icon className="h-6 w-6" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-slate-900">
                    {option.title}
                  </h3>
                  {option.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${option.badgeColor}`}>
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {option.description}
                </p>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 shrink-0 mt-3" />
            </Link>
          ))}
        </div>

        {/* Quick Preferences placeholder */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-400" /> Notifications & Privacy
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Email Updates</p>
                <p className="text-xs text-slate-400">Receive alerts when someone requests to join your trip.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-mountain-blue focus:ring-mountain-blue h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Direct Message Sound</p>
                <p className="text-xs text-slate-400">Play a notification sound when a message arrives in a trip group.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-mountain-blue focus:ring-mountain-blue h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Safety and Security placeholder */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Lock className="h-5 w-5 text-slate-400" /> Security
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">Password Change</p>
              <p className="text-xs text-slate-400">Send password reset email link to update account password.</p>
            </div>
            <Link
              href="/auth/forgot-password"
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4.5 py-2 rounded-full shadow-sm transition-colors"
            >
              Reset Password
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
