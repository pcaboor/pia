'use client';

import Link from "next/link";
import { ArrowRightIcon, Badge, Loader2, Menu, Package2 } from "lucide-react";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { ModeToggle } from "@/components/themeSwitcher";
import { useUserPostData } from "@/hook/useUserPostData";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import CodeBlock from "@/components/code-block";
import { useUserData } from "@/hook/useUserData";
import { CarouselSpacing } from "@/components/carrousel";
import { Feedback } from "@/components/feedback";
import { Paragraph } from "@/components/pricing";
import email from "next-auth/providers/email";

export default function Settings() {
  const {
    userData,
    status,
    firstName,
    lastName,
    email,
    teamName,
    error,
    successMessage,
    setFirstName,
    setLastName,
    setEmail,
    setTeamName,
    handleUpdate,
    handleDeleteUser,
    fetchUserData,
  } = useUserPostData();

  // const { userData, loading } = useUserData();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (successMessage) {
      toast({ description: "Settings updated successfully!" });
      fetchUserData();

    }
  }, [successMessage, fetchUserData, toast]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-grow flex-col ">

      {/* Responsive container */}
      <div className="flex flex-col md:flex-row gap-6 m-10">
        {/* First Block */}
        <div className="flex flex-1 rounded-2xl bg-muted/50 p-7 text-left">
          <div className="flex-col gap-1">
            <div className="flex items-center">
              <h3 className="text-2xl font-bold tracking-tight mr-2">Welcome</h3>

            </div>
            <p className="mt-3 text-muted-foreground text-[12px]">
              This reference app demonstrates how to build a multi-tenant B2B SaaS
              application powered by Auth0 by Okta.
            </p>
            <form
            onSubmit={(e) => handleUpdate(e)}
            className="flex flex-col gap-4 text-[12px]"
          >
            
            <Input
            className="text-[12px]"
              name="firstName"
              //   className="border-blue-500 text-blue-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={userData?.firstName || 'Enter first name'}
            />
            <Input
                className="text-[12px]"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={userData?.lastName || 'Enter last name'}
            />
            <Input
                className="text-[12px]"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userData?.email || 'Enter email'}
            />

            <Input
                className="text-[12px]"
              name="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder={userData?.teamName || 'Enter team name'}
            />
            <Button className="w-14" type="submit">Save</Button>
          </form>

          </div>
        </div>

        {/* Second Block */}
        <div className="flex flex-1 rounded-2xl bg-muted/50 p-7 text-left">
          <div className="flex-col gap-1">
            <div className="flex items-center">
              <h3 className="text-2xl font-bold tracking-tight mr-2">API Store</h3>

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
           


            <div className="mt-8">
              <Link href="/dashboard/settings" className="w-full">
                <Button className="w-full">
                  Navigate to Settings
                  <ArrowRightIcon className="ml-2 size-4" />
                </Button>
              </Link>
              <Button
          onClick={async () => {
            await signOut();
          }}
        >
          Log Out
        </Button>
        <Button onClick={handleDeleteUser} className="mt-4 bg-red-500 text-white hover:bg-red-600">
          Delete Account
        </Button>
            </div>
            <div className="mt-5">

            </div>
          </div>
        </div>
      </div>     
     
    </div>
  );
};

