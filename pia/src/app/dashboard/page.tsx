'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { useUserData } from '@/hook/useUserData';

import { Heading, Paragraph, Price, PricingWrapper } from '@/components/pricing';
import { Space_Grotesk } from 'next/font/google';
import { Feedback } from '@/components/feedback';
import { LightBoard } from '@/components/lightboard';

const grotesk = Space_Grotesk({ subsets: ['latin'] })

const DashboardHome: React.FC = () => {
  const { userData, loading } = useUserData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-grow flex-col gap-4 lg:gap-6">
    <div className="flex flex-1 items-center justify-center rounded-3xl border bg-muted/50  gap-6 m-10">
      <div className="flex max-w-[500px] flex-col items-center gap-1 text-center p-7">
        <h3 className="text-2xl font-bold tracking-tight">
          Welcome
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
        {userData.firstName}
        <div className="mt-8">
          <Link href="/dashboard/settings" className="w-full">
            <Button className="w-full">
              Navigate to Settings
              <ArrowRightIcon className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
        <div className='mt-5'>
        <Feedback />
        </div>
      
      </div>
    
    </div>
    {/*
    <div className={grotesk.className + ' h-[600px] w-full flex gap-12 items-center justify-center'}>
   <PricingWrapper contactHref={'/'} type={'waves'}>
      <Heading>component</Heading>
      <Price>
        $2000
        <br />
        /mo
      </Price>
      <Paragraph>
        Special UI component for your website made with React.js, TailwindCSS and FramerMotion.
      </Paragraph>
    </PricingWrapper>
  </div>*/ } 
    
    <div className="w-full bg-black">
        <LightBoard
          rows={10}
          lightSize={3}
          gap={1}
          text="USE API QUICKLY"
          font="default"
          updateInterval={50}
          colors={{
            background: "#001a00",
            textDim: "#006600",
            drawLine: "#00b300",
            textBright: "#00ff00",
          }}
        />
      </div>
  </div>
  );
};

export default DashboardHome;
