import { useEffect, useRef, useState, useCallback } from "react";
import { useUserData } from "./useUserData";

interface Team {
    teamID: string;
    teamName: string;
    team_picture?: string;
    createdBy: string;
}

export const useTeamCreate = () => {
    const { userData, error: userDataError, loading: userDataLoading } = useUserData();
    const [teamName, setTeamName] = useState<string>('');
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string>('');
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [team_picture, setTeamPicture] = useState<string | ArrayBuffer | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('File size exceeds 2 MB.');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Invalid file type. Please upload an image.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setTeamPicture(reader.result as string);
                setError(''); // Clear error on successful file load
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchTeams = useCallback(async () => {
        if (!userData) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/team');
            const data = await response.json();
            if (response.ok) {
                setTeams(data.teams);
                setError('');
            } else {
                setError(data.message || 'Failed to fetch teams');
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            setError('Failed to fetch teams');
        } finally {
            setIsLoading(false);
        }
    }, [userData]);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const handleRemoveImage = () => {
        setTeamPicture(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setError(''); // Clear error when image is removed
    };

    const handleCreateTeam = async () => {
        if (!userData) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamName, team_picture: team_picture }),
            });

            const data = await response.json();
            if (response.ok) {
                setTeamName('');
                setTeamPicture(null);
                setDialogOpen(false);
                setError('');
                await fetchTeams();
            } else {
                setError(data.message || 'Failed to create team');
            }
        } catch (error) {
            console.error('Error creating team:', error);
            setError('Failed to create team');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTeam = async (teamID: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/team?teamID=${teamID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchTeams();
                setError('');
            } else {
                const errorText = await response.text();
                setError(`Error: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting team:', error);
            setError('Failed to delete team');
        } finally {
            setIsLoading(false);
        }
    };

    if (userDataLoading) {
        return null;
    }

    return {
        teams,
        teamName,
        setTeamName,
        dialogOpen,
        setDialogOpen,
        handleCreateTeam,
        handleDeleteTeam,
        error,
        team_picture,
        handleFileChange,
        handleRemoveImage,
        fileInputRef,
        isLoading,
    };
};