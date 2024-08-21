'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>('');

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
    };

    fetchUserData();
  }, [status, session?.user?.uniqID, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-grow flex-col gap-4 lg:gap-6">
      <div className="flex flex-1 items-center justify-center rounded-3xl border bg-field shadow-sm">
        <div className="flex max-w-[500px] flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Explore the SaaS Starter
          </h3>
          <p className="mt-3 text-muted-foreground">
            This reference app demonstrates how to build a multi-tenant B2B SaaS
            application powered by Auth0 by Okta.
          </p>
          <p className="mt-3 text-muted-foreground">
            Head over to the Settings Dashboard to explore common administrative
            capabilities like membership management, single sign-on
            configuration, and security policies.
          </p>
          <div className="mt-8">
            <Link href="/dashboard/settings" className="w-full">
              <Button className="w-full">
                Navigate to Settings
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-muted-foreground">
            (You must be logged in with an &quot;admin&quot; role in your
            organization.)
          </p>
        </div>
      </div>
    </div>
  );
}
