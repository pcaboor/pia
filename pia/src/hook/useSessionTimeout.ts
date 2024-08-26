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
      }, 3600); 

      return () => clearTimeout(timeout);
    } else if (status === 'unauthenticated') {
      window.location.replace('/login');
    }
  }, [status, session]);
}
