'use client';

import Link from "next/link";
import { CircleUser, Delete, Ellipsis, Menu, Package2, Search, User2, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useRef, useState } from 'react';
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
import { useUserData } from '@/hook/useUserData';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import React from "react";
import { Label } from "@/components/ui/label";


export default function TeamsPage() {
    const { userData, error: userDataError, loading: userDataLoading } = useUserData();
    const [teamName, setTeamName] = useState('');
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [teamPicture, setTeamPicture] = useState<string | ArrayBuffer | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 1 * 2048 * 2048) {
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Invalid file type. Please upload an image.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setTeamPicture(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };
    // Fonction pour récupérer les équipes
    const fetchTeams = async () => {
        if (!userData) return;
        try {
            const response = await fetch('/api/team');
            const data = await response.json();
            if (response.ok) {
                setTeams(data.teams);
            } else {
                setError(data.message || 'Failed to fetch teams');
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            setError('Failed to fetch teams');
        }
    };
    const handleRemoveImage = () => {
        setTeamPicture(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        fetchTeams();
    }, [userData]);

    const handleCreateTeam = async () => {
        if (!userData) return;

        try {
            const response = await fetch('/api/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamName, team_picture: teamPicture }),
            });

            const data = await response.json();
            if (response.ok) {
                setTeamName('');
                setTeamPicture(null);
                setDialogOpen(false);
                fetchTeams();
            } else {
                setError(data.message || 'Failed to create team');
            }
        } catch (error) {
            console.error('Error creating team:', error);
            setError('Failed to create team');
        }
    };

    const handleDeleteTeam = async (teamID: string) => {
        try {
            const response = await fetch(`/api/team?teamID=${teamID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Team deleted successfully');
                fetchTeams(); // Réactualiser la liste des équipes après suppression
            } else {
                const errorText = await response.text();
                alert(`Error: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Failed to delete team');
        }
    };

    if (userDataLoading) {
        return
    }

    if (userDataError) {
        return <p style={{ color: 'red' }}>{userDataError}</p>;
    }

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
                                                        {teamPicture ? (
                                                            <AvatarImage src={teamPicture as string} />
                                                        ) : (
                                                            <AvatarFallback>
                                                                {teamName ? teamName[0].toUpperCase() : 'T'}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                </div>
                                            </div>
                                            {teamPicture && (
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
                                                        <AvatarImage src={team.team_picture} alt={team.teamName} />
                                                    ) : (
                                                        <AvatarFallback>
                                                            {team.teamName[0].toUpperCase()}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="text-sm ">{team.teamName}</h3>
                                                        <Badge variant="secondary">
                                                            {userData.uniqID === team.createdBy ? 'Owner' : 'Member'}
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
