import type { NextRequest } from 'next/server';
import { authMiddleware } from './app/authMiddleware';

export function middleware(request: NextRequest) {
  return authMiddleware(request);
}

export const config = {
  matcher: '/dashboard/:path*',
};
