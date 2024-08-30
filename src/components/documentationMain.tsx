import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { useUserData } from '@/hook/useUserData';

import { Space_Grotesk } from 'next/font/google';

import CodeBlock from '@/components/code-block';


import { Badge } from './ui/badge';
import { BrowserComponent } from './browser';

const grotesk = Space_Grotesk({ subsets: ['latin'] })

const DocumentationMain: React.FC = () => {
    const { userData, loading } = useUserData();

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
            <div className="flex flex-col md:flex-row gap-6 mt-10 mr-10 ml-10 mb-7">
                {/* First Block */}
                <div className="flex flex-1 rounded-2xl bg-muted/50 p-7 text-left">
                    <BrowserComponent className="w-full max-w-[600px] h-[300px]">
                        <section className="w-full h-full flex items-center justify-center">
                      
                            <img
                                src="https://i.pinimg.com/564x/20/c6/e7/20c6e7e27341a9a09c00821a99cfb17a.jpg"
                                className="w-full h-full object-cover rounded-bl rounded-br"
                                alt="Example"
                            />
                            
                        </section>
                    </BrowserComponent>
                    
                </div>
            </div>


            {/* Responsive container */}
            <div className="flex flex-col md:flex-row gap-6 ml-10 mr-10 ">
                {/* First Block */}
                <div className="flex flex-1 rounded-2xl bg-muted/50 p-7 text-left">
                    <div className="flex-col gap-1">
                        <h3 className="text-2xl font-bold tracking-tight">Welcome</h3>
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



        </div>

    );
};

export default DocumentationMain;
