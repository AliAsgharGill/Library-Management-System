import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  console.log("Token:", token);
  

  // Paths that require authentication
  const protectedPaths = ['/books', '/dashboard'];

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
  // if user role is admin then we will redirect him to /dashboard
  // else we will redirect him to /


  return NextResponse.next();
}
