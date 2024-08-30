// src/hooks/useUserData.ts
import { useState } from 'react';
import { signIn } from 'next-auth/react';

type LoginInput = {
  email: string;
  password: string;
}

export function useUserLogin() {
  const [inputs, setInputs] = useState<LoginInput>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", { 
        email: inputs.email, 
        password: inputs.password, 
        callbackUrl: '/dashboard' 
      });
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    inputs,
    error,
    isLoading,
    handleChange,
    handleSubmit
  };
}
