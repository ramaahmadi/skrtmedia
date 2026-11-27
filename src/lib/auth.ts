import crypto from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'skrt_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
  phone: string;
  name: string;
  isAdmin: boolean;
}

interface SessionPayload {
  user: SessionUser;
  exp: number;
}

function getSessionSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.DATABASE_URL ||
    'skrtmedia-default-session-secret-change-in-production'
  );
}

function sign(data: string): string {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(data)
    .digest('base64url');
}

export function createSessionToken(user: SessionUser): string {
  const payload: SessionPayload = {
    user,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSig = sign(encodedPayload);

  // Constant-time comparison
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as SessionPayload;

    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload.user;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function requireAuth(): Promise<
  { user: SessionUser; errorResponse: null } | { user: null; errorResponse: Response }
> {
  const user = await getServerSession();
  if (!user) {
    return {
      user: null,
      errorResponse: Response.json(
        { error: 'Unauthorized. Silakan login terlebih dahulu.' },
        { status: 401 }
      ),
    };
  }
  return { user, errorResponse: null };
}

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}
