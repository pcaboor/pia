import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export const useUserPostData = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [teamName, setTeamName] = useState<string>('');

    const [successMessage, setSuccessMessage] = useState<string>('');

    const fetchUserData = useCallback(async () => {
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
    }, [session?.user?.uniqID]);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        fetchUserData();
    }, [status, fetchUserData, router]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const response = await fetch(`/api/user/${userData?.uniqID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, teamName }),
            });
            if (!response.ok) throw new Error('Failed to update user data');
            await fetchUserData(); // Fetch updated data
            
            setSuccessMessage('User updated successfully');
        } catch (error) {
            setError('Failed to update user data');
        }
    };

    const handleDeleteUser = async () => {
        if (userData?.uniqID) {
            try {
                const response = await fetch(`/api/user/${userData.uniqID}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete user');
                setSuccessMessage('User deleted successfully');
                setUserData(null);
                await signOut();
                router.push('/login');
            } catch (error) {
                setError('Failed to delete user');
            }
        }
    };

    return {
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
    };
};
