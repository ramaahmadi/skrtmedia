import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  
  // Supabase auth removed - redirect directly
  return NextResponse.redirect(new URL('/skrt-army', requestUrl.origin))
}
