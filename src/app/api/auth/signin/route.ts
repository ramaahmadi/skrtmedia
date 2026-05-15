import { NextRequest, NextResponse } from 'next/server';

// Define the only allowed user credentials
const ALLOWED_USER = {
  email: 'skrtmediaindonesia@gmail.com',
  password: 'sempatkelamresahtinggalkan',
  name: 'SKRT MEDIA Admin'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Check if credentials match the allowed user
    if (email !== ALLOWED_USER.email || password !== ALLOWED_USER.password) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Create user object for the allowed user
    const user = {
      id: 1,
      name: ALLOWED_USER.name,
      email: ALLOWED_USER.email,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    // Simulate JWT token (in real app, use proper JWT library)
    const token = btoa(JSON.stringify({ user, exp: Date.now() + 24 * 60 * 60 * 1000 })); // 24 hours

    return NextResponse.json({
      message: 'Login berhasil',
      user,
      token
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
