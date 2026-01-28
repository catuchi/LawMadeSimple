import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';
import { PROTECTED_ROUTES, AUTH_PAGES, DEFAULT_REDIRECT } from '@/constants/auth';

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClient(request);
  const { pathname } = request.nextUrl;

  // Refresh the session to keep user logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the current path matches protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is an auth page
  const isAuthPage = AUTH_PAGES.some((page) => pathname === page);

  // Redirect unauthenticated users from protected routes to sign-in
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL(DEFAULT_REDIRECT.UNAUTHENTICATED, request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users from auth pages to dashboard
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT.AFTER_SIGN_IN, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
