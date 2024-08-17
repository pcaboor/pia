// hooks/useSessionTimeout.ts
'use client'
import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';

export function useSessionTimeout() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const timeout = setTimeout(() => {
        signOut({ redirect: false });
      }, 30000); // 30 secondes

      return () => clearTimeout(timeout);
    }
  }, [session]);
}