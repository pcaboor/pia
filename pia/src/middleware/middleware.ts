// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });

  // Vérifiez si le token existe et n'est pas expiré
  if (!token || token.exp * 1000 < Date.now()) {
    // Si le token n'existe pas ou est expiré, redirigez vers la page de connexion
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si le token est valide, permettez l'accès à la route protégée
  return NextResponse.next();
}

// Spécifiez les routes à protéger
export const config = {
  matcher: ['/dashboard/:path*']
};