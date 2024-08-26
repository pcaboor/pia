import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../utils/db';
import { getToken } from 'next-auth/jwt';

// Fonction pour obtenir les équipes d'un utilisateur spécifique
const getTeamsForUser = async (userId: string) => {
    const connection = await pool.promise().getConnection();
    try {
        const query = `
            SELECT t.*, u.firstName AS creatorName, u.userImage AS creatorPhoto, t.team_picture
            FROM teams t
            JOIN users u ON t.createdBy = u.uniqID
            WHERE t.createdBy = ?
        `;
        const [results] = await connection.query(query, [userId]);
        return results;
    } finally {
        connection.release();
    }
}; 

// Fonction pour authentifier l'utilisateur
const authenticate = async (req: NextRequest) => {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    return token.sub;
};

// Gestionnaire de la requête GET pour récupérer les équipes
export async function GET(req: NextRequest) {
    const userId = await authenticate(req);
    if (userId instanceof NextResponse) return userId;

    try {
        const teams = await getTeamsForUser(userId);
        return new NextResponse(
            JSON.stringify({ teams }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching teams:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Fonction pour insérer une équipe dans la base de données
const insertTeamInDB = async (teamName: string, createdBy: string, team_picture: string) => {
    const connection = await pool.promise().getConnection();
    try {
        const insertQuery = `
            INSERT INTO teams (teamID, teamName, createdBy, createdAt, team_picture)
            VALUES (UUID(), ?, ?, NOW(), ?)
        `;
        const [result] = await connection.query(insertQuery, [teamName, createdBy, team_picture]);

        const insertId = (result as any).insertId;
        return insertId;
    } finally {
        connection.release();
    }
};

// Gestionnaire de la requête POST pour créer une équipe
export async function POST(req: NextRequest) {
    const teamData = await req.json();
    
    const createdBy = await authenticate(req);
    if (createdBy instanceof NextResponse) return createdBy;

    const { teamName, team_picture } = teamData;

    if (!teamName) {
        return new NextResponse('Team name is required.', { status: 400 });
    }

    try {
        const teamID = await insertTeamInDB(teamName, createdBy, team_picture || '');
        return new NextResponse(
            JSON.stringify({ message: 'Team created successfully.', teamID }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in team creation:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Fonction pour supprimer une équipe dans la base de données
const deleteTeamInDB = async (teamID: string, userID: string) => {
    const connection = await pool.promise().getConnection();
    try {
        // Vérifier si l'équipe appartient à l'utilisateur
        const checkQuery = `SELECT createdBy FROM teams WHERE teamID = ?`;
        const [checkResult] = await connection.query(checkQuery, [teamID]);

        if ((checkResult as any).length === 0) {
            throw new Error('Team not found');
        }

        const teamCreatorID = (checkResult as any)[0].createdBy;
        
        if (teamCreatorID !== userID) {
            throw new Error('Forbidden');
        }

        // Supprimer l'équipe
        const deleteQuery = `DELETE FROM teams WHERE teamID = ?`;
        const [result] = await connection.query(deleteQuery, [teamID]);
        return result;
    } finally {
        connection.release();
    }
};

// Fonction pour supprimer un utilisateur
export async function DELETE(req: NextRequest) {
    const userId = await authenticate(req);
    if (userId instanceof NextResponse) return userId;

    const url = new URL(req.url);
    const teamID = url.searchParams.get('teamID');
    
    if (!teamID) {
        return new NextResponse('Team ID is required.', { status: 400 });
    }

    try {
        await deleteTeamInDB(teamID, userId);
        return new NextResponse('Team deleted successfully', { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Forbidden') {
                return new NextResponse('Forbidden', { status: 403 });
            }
            if (error.message === 'Team not found') {
                return new NextResponse('Team not found', { status: 404 });
            }
            console.error('Error deleting team:', error);
            return new NextResponse(error.message, { status: 500 });
        }
        console.error('Unexpected error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
