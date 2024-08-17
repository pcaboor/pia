// src/app/dashboard/page.tsx
"use client"; // Ensure this line is present

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Update import here
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Optionally return a different component or redirect
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Your dashboard content here */}
    </div>
  );
}
