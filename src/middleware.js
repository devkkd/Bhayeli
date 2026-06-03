import { NextResponse } from 'next/server';
import { verifyToken } from './server/utils/token.js';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Inject x-pathname header so that Server Components (like root layout.js)
  // can dynamically find the current pathname to conditionally hide Header/Footer.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  
  const token = request.cookies.get('admin_token')?.value;
  const isValid = token ? await verifyToken(token) : null;

  // 1. Protection for admin dashboard and sub-pages
  if (pathname.startsWith('/admin/dashboard')) {
    if (!isValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  // 2. Redirect logged-in admin away from login page
  if (pathname === '/admin') {
    if (isValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

// Run middleware on admin routes and user pages, ignoring files and next internals
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|image|.*\\.).*)'
  ]
};
