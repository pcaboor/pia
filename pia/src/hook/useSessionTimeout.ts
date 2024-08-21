'use client'
import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';

export function useSessionTimeout() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      // Définir un délai pour la session (par exemple, 30 minutes)
      const timeout = setTimeout(() => {
        signOut({ redirect: false }); // Déconnexion sans redirection
      }, 5); 

      return () => clearTimeout(timeout);
    }
  }, [status, session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirigez vers la page de connexion en cas de non-authentification
      window.location.href = '/login';
    }
  }, [status]);
}
