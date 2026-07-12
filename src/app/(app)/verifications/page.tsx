import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import VerificationClient from '@/components/features/VerificationClient';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';

export default async function VerificationPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialProfile = null;
  if (user) {
    initialProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        isVerified: true,
        verificationDoc: true,
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 pt-24 w-full">
        <VerificationClient initialProfile={initialProfile} />
      </main>
      <Footer />
    </div>
  );
}

