import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Supabase credentials missing in environment variables. Bypassing session refreshing in middleware.');
    return response;
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Calling getUser refreshes the session token automatically if expired
  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (err) {
    console.warn('Supabase session lookup failed in middleware:', err);
  }

  const nextUrl = request.nextUrl;
  const path = nextUrl.pathname;

  // Define route rules
  const isProtectedRoute = 
    path.startsWith('/dashboard') ||
    path.startsWith('/trips') ||
    path.startsWith('/create-trip') ||
    path.startsWith('/messages') ||
    path.startsWith('/profile') || 
    path.startsWith('/notifications') ||
    path.startsWith('/settings') ||
    path.startsWith('/verifications');

  const isAuthOrLandingRoute = 
    path === '/' ||
    path === '/login' ||
    path === '/signup' ||
    path.startsWith('/auth/login') ||
    path.startsWith('/auth/signup');

  // If unauthenticated user tries to access a protected route
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    // Remember where the user was trying to go so we can redirect them back after login
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated user tries to visit landing page or login/signup routes
  if (isAuthOrLandingRoute && user && !path.startsWith('/auth/callback') && !path.startsWith('/auth/reset-password')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

// Config to specify matching routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
