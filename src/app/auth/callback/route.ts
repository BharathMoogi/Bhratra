import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      const user = data.user;
      
      // Sync auth user account and details to database
      try {
        // 1. Ensure User model is present
        let dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              id: user.id,
              email: user.email!,
              role: 'USER',
              status: 'ACTIVE',
            },
          });
        }

        // 2. Ensure Profile details model is present
        const existingProfile = await prisma.profile.findUnique({
          where: { id: user.id },
        });

        if (!existingProfile) {
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null;
          const avatarUrl = user.user_metadata?.avatar_url || null;

          await prisma.profile.create({
            data: {
              id: user.id,
              fullName: fullName,
              avatarUrl: avatarUrl,
              isVerified: false,
            },
          });
        }
      } catch (dbError) {
        console.error('Database user/profile sync failed in callback:', dbError);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
