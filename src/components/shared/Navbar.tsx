import { getCachedUser } from '@/lib/supabase-server';
import NavbarClient from './NavbarClient';

/**
 * Navbar — thin Server Component wrapper.
 *
 * Reads the authenticated user once (via the request-memoized getCachedUser),
 * then passes it as a prop to NavbarClient. This means:
 * 1. The client-side `supabase.auth.getUser()` call is eliminated on first paint.
 * 2. The navbar renders with the correct logged-in/out state immediately — no flash.
 * 3. NavbarClient still subscribes to onAuthStateChange for subsequent sign-in/out events.
 */
export default async function Navbar() {
  const user = await getCachedUser();
  return <NavbarClient initialUser={user} />;
}
