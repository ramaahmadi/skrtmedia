import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const userSession = request.cookies.get('user_session')?.value
  const user = userSession ? JSON.parse(userSession) : null

  // Redirect unauthenticated users trying to access protected routes
  const protectedRoutes = ['/skrt-army']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

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
}
