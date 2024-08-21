'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { useUserData } from '@/hook/useUserData';

const DashboardHome: React.FC = () => {
  const { userData } = useUserData();

  return (
    <div className="flex flex-1 flex-grow flex-col gap-4 lg:gap-6">
    <div className="flex flex-1 items-center justify-center rounded-3xl border bg-muted/50  gap-6 m-10">
      <div className="flex max-w-[500px] flex-col items-center gap-1 text-center p-7">
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
              <ArrowRightIcon className="ml-2 size-4" />
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
};

export default DashboardHome;
