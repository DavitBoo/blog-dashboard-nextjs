import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const token = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect all dashboard routes
};
