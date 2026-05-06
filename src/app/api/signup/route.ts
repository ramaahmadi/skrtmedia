import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, name, phone, role = 'member' } = await request.json()

    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'Email, password, name, and phone are required' },
        { status: 400 }
      )
    }

    // Supabase authentication removed - return mock response
    return NextResponse.json({ 
      success: true,
      user: { id: Date.now(), email, name, phone, role },
      message: 'User created successfully (mock)' 
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
