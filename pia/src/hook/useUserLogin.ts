// hooks/useLoginForm.ts
import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';

interface User {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password,
    });

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      window.location.replace( '/dashboard');
    }
  };

    // Github Login
    const handleGithubLogin = () => {
        signIn('github', { callbackUrl: '/dashboard' })
      }

  return {
    user,
    error,
    handleChange,
    handleSubmit,
    handleGithubLogin,
  };
};

