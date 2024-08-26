'use client';

import Link from "next/link";
import { Loader2, Menu, Package2 } from "lucide-react";
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
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 gap-4 px-10 md:px-10 justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground font-light"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground font-light"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground font-light"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground font-light"
              >
                Customers
              </Link>
              <Link href="#" className="hover:text-foreground font-light">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-muted-foreground hover:text-foreground font-light">
            <Link href="#" className="text-muted-foreground hover:text-foreground font-light">
              General
            </Link>
            <Link href="#">Team</Link>
          </nav>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Name</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => handleUpdate(e)}
                  className="flex flex-col gap-4"
                >
                 <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
                  <Input
                    name="firstName"
                 //   className="border-blue-500 text-blue-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={userData?.firstName || 'Enter first name'}
                  />
                  <Input
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={userData?.lastName || 'Enter last name'}
                  />
                  <Input
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={userData?.email || 'Enter email'}
                  />
                  <Input
                    name="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder={userData?.teamName || 'Enter team name'}
                  />
                  <Button className="w-40" type="submit">Save</Button>
                </form>
                <CodeBlock value={'const response = await fetch(`/api/user/${session.user.uniqID}`);'}/>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Profil Avatar</CardTitle>
                <CardDescription>
                  The directory within your project, in which your plugins are located.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4">
                
                </form>
              </CardContent>


            
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Plugins Directory</CardTitle>
                <CardDescription>
                  The directory within your project, in which your plugins are located.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4">
                  <Input
                    placeholder="Project Name"
                    defaultValue="/content/plugins"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include" defaultChecked />
                    <label
                      htmlFor="include"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Allow administrators to change the directory.
                    </label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
              {userData && (
                <Table>
                  <TableCaption>Your data</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell className="text-blue-500">{userData.firstName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Last Name</TableCell>
                      <TableCell>{userData.lastName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{userData.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Team Name</TableCell>
                      <TableCell>{userData.teamName}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
              {error && <div className="text-red-500">{error}</div>}
              {successMessage && <div className="text-green-500">{successMessage}</div>}
              <ModeToggle />
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
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
