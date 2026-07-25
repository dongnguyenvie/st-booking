import { cookies } from 'next/headers';

export interface Session {
  token: string;
  userId: string;
}

/**
 * Data Access Layer — read session from HttpOnly cookie (server-side only).
 * Use this in Server Components / Route Handlers for auth checks.
 * Never trust middleware alone (CVE-2025-29927).
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return null;

  // TODO: verify JWT signature here (e.g. jose.jwtVerify)
  // For now, just check presence
  return { token, userId: '' };
}

/** Throw redirect if not authenticated — use inside Server Components */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  return session as Session;
}
