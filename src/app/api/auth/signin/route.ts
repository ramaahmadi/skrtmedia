import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, getSessionCookieOptions, SessionUser } from '@/lib/auth';
import { getAllAnggota } from '@/lib/db-queries';

const DEFAULT_ADMIN_PHONE = process.env.ADMIN_PHONE || '082122451622';

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, '').trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPhone = typeof body.phone === 'string' ? body.phone : '';
    const phone = normalizePhone(rawPhone);

    if (!phone || phone.length < 10 || !/^\+?\d+$/.test(phone)) {
      return NextResponse.json(
        { error: 'Nomor HP tidak valid (minimal 10 digit angka)' },
        { status: 400 }
      );
    }

    const isDefaultAdmin = phone === normalizePhone(DEFAULT_ADMIN_PHONE);
    let sessionUser: SessionUser | null = null;

    try {
      const members = await getAllAnggota();
      const matchedMember = members.find(
        (m: any) => normalizePhone(String(m.phone || '')) === phone
      );

      if (matchedMember) {
        sessionUser = {
          phone,
          name: matchedMember.name || (isDefaultAdmin ? 'RAMA' : 'Anggota'),
          isAdmin: Boolean(matchedMember.is_admin) || isDefaultAdmin,
        };
      } else if (isDefaultAdmin) {
        sessionUser = {
          phone,
          name: 'RAMA',
          isAdmin: true,
        };
      }
    } catch (dbError) {
      console.error('Database lookup error during signin:', dbError);
      // Allow default admin login even if DB is temporarily unreachable
      if (isDefaultAdmin) {
        sessionUser = {
          phone,
          name: 'RAMA',
          isAdmin: true,
        };
      } else {
        return NextResponse.json(
          { error: 'Gagal memverifikasi keanggotaan. Silakan coba lagi.' },
          { status: 503 }
        );
      }
    }

    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Nomor HP tidak terdaftar sebagai panitia/anggota SKRT.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(sessionUser);
    const response = NextResponse.json({
      message: 'Login berhasil',
      user: sessionUser,
    });

    const cookieOpts = getSessionCookieOptions();
    response.cookies.set(cookieOpts.name, token, {
      httpOnly: cookieOpts.httpOnly,
      secure: cookieOpts.secure,
      sameSite: cookieOpts.sameSite,
      path: cookieOpts.path,
      maxAge: cookieOpts.maxAge,
    });

    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
