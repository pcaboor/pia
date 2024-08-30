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
    // Gestion du cas où la session est encore en cours de chargement
    if (status === 'loading') {
      return;
    }

    // Redirection pour les utilisateurs non authentifiés
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Fonction pour récupérer les données de l'utilisateur
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          console.log(session.user.id)
          const response = await fetch(`/api/user/${session.user.id}`);

          // Gestion des réponses non réussies
          if (!response.ok) {
            if (response.status === 404) {
              setError('User not found');
            } else {
              setError('Failed to fetch user data');
            }
            return;
          }

          // Extraction des données utilisateur
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          setError('Failed to load user data');
        }
      } else {
        setError('No user ID found');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [status, session?.user?.id, router]);

  return { userData, error, loading };
};
