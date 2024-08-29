// src/middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next'; 
import { authOptions } from '../server/auth';

export async function middleware(request: NextRequest) {
  // Vérifiez si la route est protégée
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Obtenez la session de l'utilisateur
    const session = await getServerSession(authOptions);

    // Si l'utilisateur n'est pas authentifié, redirigez vers la page de connexion
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/login'; // Rediriger vers la page de connexion
      return NextResponse.redirect(url);
    }
  }

  // Continuez le traitement pour les routes non protégées ou les utilisateurs authentifiés
  return NextResponse.next();
}

// Spécifiez les chemins pour lesquels ce middleware doit être appliqué
export const config = {
  matcher: ['/dashboard/:path*', 'api/:path*'], // Appliquez le middleware uniquement aux routes /dashboard et ses sous-routes
};
