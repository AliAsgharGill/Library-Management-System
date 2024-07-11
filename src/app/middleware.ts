import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const role = req.cookies.get('user')?.value; // Assuming the user role is stored in a cookie
  
  // Paths that require authentication
  const protectedPaths = ['/dashboard'];

  // Check for authentication
  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    console.log("Protected path:", req.nextUrl.pathname);
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      // Redirect non-admin users to the homepage
      return NextResponse.redirect(new URL('/', req.url));
    }
    
  } 
  

  return NextResponse.next();
}
