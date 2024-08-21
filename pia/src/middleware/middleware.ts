import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const tokenExpiry = token?.exp ? Number(token.exp) : undefined;

  if (!token || (tokenExpiry && tokenExpiry * 1000 < Date.now())) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
  
}

export const config = {
  matcher: ['/settings/:path*', '/api/:path*'],
};
