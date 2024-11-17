import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('token');
  const url = request.nextUrl;

  // Define protected and public routes
  const protectedRoutes = ['/dashboard', '/user'];
  const publicRoutes = ['/', '/sign-in', '/sign-up'];

  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(url.pathname);

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !tokenCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect authenticated users trying to access public routes
  if (tokenCookie && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow access to other routes
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: ['/user/:path*', '/dashboard/:path*', '/book-ride', '/about', '/sign-in', '/sign-up'],
};
