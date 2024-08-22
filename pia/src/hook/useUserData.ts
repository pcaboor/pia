// hooks/useUserData.ts
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useUserData = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      if (session?.user?.uniqID) {
        try {
          const response = await fetch(`/api/user/${session.user.uniqID}`);
          if (!response.ok) throw new Error('Failed to fetch user data');
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          setError('Failed to load user data');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [status, session?.user?.uniqID, router]);

  return { userData, error, loading };
};
