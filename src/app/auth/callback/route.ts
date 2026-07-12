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

      try {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null;
        const avatarUrl = user.user_metadata?.avatar_url || null;

        // Parallel upserts — one DB round-trip each, running concurrently
        // Replaces the previous sequential findUnique → create pattern
        await Promise.all([
          prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: {
              id: user.id,
              email: user.email!,
              role: 'USER',
              status: 'ACTIVE',
            },
          }),
          prisma.profile.upsert({
            where: { id: user.id },
            update: {},
            create: {
              id: user.id,
              fullName,
              avatarUrl,
              isVerified: false,
            },
          }),
        ]);
      } catch (dbError) {
        console.error('Database user/profile sync failed in callback:', dbError);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
