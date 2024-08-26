'use client';

import Link from "next/link";
import {  Ellipsis, Loader2, Search, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import React from "react";
import { Label } from "@/components/ui/label";
import { useTeamCreate } from "@/hook/useTeamCreate";
import { useUserData } from "@/hook/useUserData";


export default function TeamsPage() {
    const teamCreate = useTeamCreate();
    const { userData } = useUserData();

    if (!teamCreate) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }
    const {
        teams,
        teamName,
        setTeamName,
        dialogOpen,
        fileInputRef,
        setDialogOpen,
        handleCreateTeam,
        handleDeleteTeam,
        error,
        team_picture,
        handleFileChange,
        handleRemoveImage,
    } = teamCreate;

    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                        <Users2 className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        Dashboard
                    </Link>
                    <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        Orders
                    </Link>
                    <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        Products
                    </Link>
                    <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        Customers
                    </Link>
                    <Link href="#" className="text-foreground transition-colors hover:text-foreground">
                        Settings
                    </Link>
                </nav>

            </header>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">Teams</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <nav className="grid gap-4 text-sm text-muted-foreground">
                        <Link href="#" className="font-semibold text-primary">
                            General
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground font-light">Security</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground font-light">Integrations</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground font-light">Support</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground font-light">Organizations</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground font-light">Advanced</Link>

                    </nav>
                    <div className="grid gap-6">

                        <Card className="border-none shadow-none">
                            <CardHeader>

                                <div className="flex items-center justify-between">

                                    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                                        <form className="ml-auto flex-1 ">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input type="search" placeholder="Search teams..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
                                            </div>
                                        </form>
                                    </div>
                                    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button onClick={() => setDialogOpen(true)} className="text-sm">
                                                Create Team
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Create a New Team</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Enter the name and add a picture for your new team.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <Input
                                                type="text"
                                                value={teamName}
                                                onChange={(e) => setTeamName(e.target.value)}
                                                placeholder="Enter team name"
                                                className="mb-4"
                                            />
                                            <div className="flex items-end gap-4 mb-4">
                                                <div className="flex flex-col w-full max-w-sm gap-1.5">
                                                    <Label htmlFor="teamImage">Team Picture</Label>
                                                    <Input
                                                        id="teamImage"
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <Avatar>
                                                        {team_picture ? (
                                                            <AvatarImage src={team_picture as string} />
                                                        ) : (
                                                            <AvatarFallback>
                                                                {teamName ? teamName[0].toUpperCase() : 'T'}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                </div>
                                            </div>
                                            {team_picture && (
                                                <Button type="button" variant="secondary" onClick={handleRemoveImage} className="mb-4">
                                                    Remove Image
                                                </Button>
                                            )}
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={() => setDialogOpen(false)}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleCreateTeam} >
                                                    Create Team
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                </div>
                            </CardHeader>

                            <CardContent>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                {teams.length === 0 ? (
                                    <p className="text-center">No team</p>
                                ) : (
                                    <div className="mt-4">
                                        {teams.map((team) => (
                                            <div key={team.teamID} className="flex items-center space-x-3 mb-4 p-4 border rounded-lg">
                                                <Avatar>
                                                    {team.team_picture ? (
                                                        <AvatarImage src={team.team_picture} alt={team.teamName}  />
                                                    ) : (
                                                        <AvatarFallback>
                                                            {team.teamName ? team.teamName[0].toUpperCase() : 'T'}
                                                        </AvatarFallback>
                                                    )}
                                                    
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="text-sm ">{team.teamName}</h3>
                                                        <Badge variant="secondary">
                                                            {userData && userData.uniqID === team.createdBy ? 'Owner' : 'Member'}
                                                        </Badge>

                                                    </div>
                                                    <p className="text-xs font-mono">{team.teamID}</p>

                                                </div>
                                                <Button className="text-blue-500 font-light" variant="link">/api/test</Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button onClick={() => handleDeleteTeam(team.teamID)} variant="ghost">
                                                            <Ellipsis className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-56">
                                                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuCheckboxItem>
                                                            Copy invite URL
                                                        </DropdownMenuCheckboxItem>
                                                        <DropdownMenuCheckboxItem>
                                                            Manage

                                                        </DropdownMenuCheckboxItem>
                                                        <DropdownMenuCheckboxItem
                                                            className="text-red"
                                                            onClick={() => handleDeleteTeam(team.teamID)}
                                                        >
                                                            Delete team
                                                        </DropdownMenuCheckboxItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}

                                    </div>
                                )}
                            </CardContent>

                        </Card>


                    </div>
                </div>
            </main>
        </div>
    );
}
