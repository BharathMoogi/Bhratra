import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import AdminDashboard from '@/components/features/AdminDashboard';
import { getAdminStatsAction } from './actions';
import { Shield, AlertCircle } from 'lucide-react';

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 1. Enforce access control: check user role inside database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || dbUser.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Administrator permissions are required to access this dashboard.
          </p>
          <Link href="/" className="text-primary font-semibold hover:underline">
            Return to Homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Fetch initial analytics stats
  const res = await getAdminStatsAction();

  if (res.error || !res.stats) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Analytics Loading Error</h2>
          <p className="text-muted-foreground text-center">
            {res.error || 'Failed to pull system statistics.'}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 pt-24 w-full space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 bg-primary/10 rounded-full text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Administrative Panel</h1>
            <p className="text-xs text-muted-foreground">Monitor system health, check user profiles, audit trips, and resolve moderation flags.</p>
          </div>
        </div>

        {/* Dashboard component */}
        <AdminDashboard
          initialStats={res.stats}
          initialTripTypeData={res.tripTypeChartData || []}
          recentTravelers={res.recentTravelers || []}
        />
      </main>
      <Footer />
    </div>
  );
}
