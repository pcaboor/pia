'use client';

import Link from "next/link";
import { Loader2, Menu, Package2 } from "lucide-react";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

import { ModeToggle } from "@/components/themeSwitcher";


export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');


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
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setEmail(data.email || '');
          setTeamName(data.teamName || '');
        } catch (error) {
          setError('Failed to load user data');
        }
      }
    };

    fetchUserData();
  }, [status, session?.user?.uniqID, router]);

  const handleUpdate = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/user/${userData.uniqID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, teamName }),
      });
      if (!response.ok) throw new Error('Failed to update user data');
      const data = await response.json();
      setUserData((prevData: any) => ({
        ...prevData,
        firstName,
        lastName,
        email,
        teamName,
      }));
      alert('User updated successfully');
    } catch (error) {
      setError('Failed to update user data');
    }
  };

  const handleDeleteUser = async () => {
    if (userData && userData.uniqID) {
      try {
        const response = await fetch(`/api/user/${userData.uniqID}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');
        setSuccessMessage('User deleted successfully');
        setUserData(null);
        await signOut(); // Optionnel : Déconnecter l'utilisateur après la suppression
        router.push('/login'); // Redirection après suppression
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 gap-4  px-10 md:px-10 justify-between">
        
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
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link href="#" className="hover:text-foreground">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4  p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <Link href="#" className="font-semibold text-primary">
              General
            </Link>
            <Link href="#">Team</Link>
          </nav>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Name</CardTitle>
                <CardDescription>
                  Used to identify your store in the marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                  <Input
                    name="firstName"
                    className="border-blue-500 text-blue-500"
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
                      <TableCell>
                        {userData.uniqID}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
              {error && <div className="text-red-500">{error}</div>}
              {successMessage && <div className="text-green-500">{successMessage}</div>}
              <ModeToggle/>
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
