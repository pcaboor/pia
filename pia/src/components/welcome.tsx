'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { useUserData } from '@/hook/useUserData';
import { Paragraph } from '@/components/pricing';
import { Space_Grotesk } from 'next/font/google';
import { Feedback } from '@/components/feedback';
import CodeBlock from '@/components/code-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarouselSpacing } from './carrousel';
import { Badge } from './ui/badge';
import { useEffect, useState } from 'react';

const grotesk = Space_Grotesk({ subsets: ['latin'] })

const DashboardHome: React.FC = () => {
  const { userData, loading } = useUserData();



function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return isDarkMode;
}

  const isDarkMode = useDarkMode();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-grow flex-col">

      {/* Responsive container */}
      <div className="flex flex-col md:flex-row gap-6 m-10">
        {/* First Block */}
        <div className="flex flex-1 rounded-2xl bg-muted/50 p-7 text-left">
          <div className="flex-col gap-1">
          <div className="flex items-center">
              <h3 className="text-2xl font-bold tracking-tight mr-2">Welcome</h3>
              <Badge className="bg-[#c6e7fc] text-[#2e95d3] hover:bg-[#c6e7fc]">Tuto</Badge>
            </div>
            <p className="mt-3 text-muted-foreground text-xs">
              This reference app demonstrates how to build a multi-tenant B2B SaaS
              application powered by Auth0 by Okta.
            </p>
            <p className="mt-3 text-muted-foreground text-xs">
              Head over to the Settings Dashboard to explore common administrative
              capabilities like membership management, single sign-on
              configuration, and security policies.
            </p>
            <div className='flex mt-7'>
              <CodeBlock className='text-xs' value={`import OpenAI from "openai";

const openai = new OpenAI();
                
const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
        {"role": "user", "content": "write a haiku about ai"}
    ]
});
`} />
            </div>
          </div>
        </div>

        {/* Second Block */}
        <div className="flex flex-1 rounded-2xl bg-muted/50 p-7 text-left">
          <div className="flex-col gap-1">
            <div className="flex items-center">
              <h3 className="text-2xl font-bold tracking-tight mr-2">API Store</h3>
              <Badge className="bg-[#d2f4d3] text-[#1b5d4a] hover:bg-[#d2f4d3]">Badge</Badge>
            </div>


            <p className="mt-3 text-muted-foreground text-xs">
              This reference app demonstrates how to build a multi-tenant B2B SaaS
              application powered by Auth0 by Okta.
            </p>
            <p className="mt-3 text-muted-foreground text-xs">
              Head over to the Settings Dashboard to explore common administrative
              capabilities like membership management, single sign-on
              configuration, and security policies.
            </p>
            <div className="flex justify-center items-center p-4">
              <CarouselSpacing />
            </div>


            <div className="mt-8">
              <Link href="/dashboard/settings" className="w-full">
                <Button className="w-full">
                  Navigate to Settings
                  <ArrowRightIcon className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-5">

            </div>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-10">
  
  <Card
    className="bg-cover bg-center text-white text-left"
    style={{ backgroundImage: `url('${isDarkMode ? "https://i.pinimg.com/564x/f8/02/6e/f8026ea5f24f253b9cdd28ae1553d737.jpg" : "https://i.pinimg.com/564x/20/c6/e7/20c6e7e27341a9a09c00821a99cfb17a.jpg"}')` }} // Remplacez par votre URL d'image
  >
    <CardHeader className="items-start">
      <CardTitle>Documentation C</CardTitle>
    </CardHeader>
    <CardContent>
      <Paragraph>
        Full-stack web application development with a focus on scalability and user experience.
      </Paragraph>
    </CardContent>
  </Card>
  
  <Card
    className="bg-cover bg-center text-white text-xs text-left"
    style={{ backgroundImage: `url('${isDarkMode ? "https://i.pinimg.com/564x/f1/fb/62/f1fb62d99f341da7e633315e0bb73df3.jpg" : "https://i.pinimg.com/564x/da/86/9b/da869b37370e42d01c8138151eb6c9bc.jpg"}')` }} // Remplacez par votre URL d'image
  >
    <CardHeader className="items-start">
      <CardTitle>Documentation D</CardTitle>
    </CardHeader>
    <CardContent>
      <Paragraph className="text-xs">
        End-to-end testing strategy and implementation using modern tools like Cypress.
      </Paragraph>
    </CardContent>
  </Card>

  <Card className="text-left">
    <CodeBlock value={'const response = await fetch(`/api/user/${session.user.uniqID}`);'} />
  </Card>

  <Card className="text-left">
    <CodeBlock value={'const data = await api.get(`/v1/users/${user.id}/details`);'} />
  </Card>
 
</div>
<Feedback />

</div>
  );
};

export default DashboardHome;
