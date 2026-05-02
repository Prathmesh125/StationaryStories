import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get('auth-token'); // Checking for auth token
  const { pathname } = req.nextUrl;

  if (!isLoggedIn) {
    // Redirect unauthenticated users from `/` to `/login`
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } else {
    // Redirect authenticated users from `/login` to `/`
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to all pages except static resources and API routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|public/|assets/).*)',
  ],
};
