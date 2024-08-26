import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import pool from '../../../../utils/db';

// Fonction pour obtenir le token JWT de l'utilisateur
const authenticate = async (req: Request) => {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    return token.sub;
};

// Fonction pour obtenir les données utilisateur
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const userId = await authenticate(req);
    if (userId instanceof NextResponse) return userId;

    const { id } = params;
    if (userId !== id) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    try {
        const query = 'SELECT * FROM users WHERE uniqID = ?';
        const [results] = await pool.promise().query(query, [id]);

        if (results.length === 0) {
            return new NextResponse('User not found', { status: 404 });
        }

        return new NextResponse(JSON.stringify(results[0]), { status: 200 });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Fonction pour mettre à jour les données utilisateur
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const userId = await authenticate(req);
    if (userId instanceof NextResponse) return userId;

    const { id } = params;
    if (userId !== id) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    const { firstName, lastName, email, teamName } = await req.json();

    if (!firstName || !lastName || !email) {
        return new NextResponse('Missing required fields', { status: 400 });
    }

    const query = `
        UPDATE users SET firstName = ?, lastName = ?, email = ?, teamName = ?
        WHERE uniqID = ?`;

    try {
        const [results] = await pool.promise().query(query, [firstName, lastName, email, teamName, id]);

        if (results.affectedRows === 0) {
            return new NextResponse('User not found', { status: 404 });
        }

        return new NextResponse('User updated successfully', { status: 200 });
    } catch (error) {
        console.error('Error updating user data:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Fonction pour supprimer un utilisateur
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const userId = await authenticate(req);
    if (userId instanceof NextResponse) return userId;

    const { id } = params;
    if (userId !== id) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    const query = `DELETE FROM users WHERE uniqID = ?`;

    try {
        const [results] = await pool.promise().query(query, [id]);

        if (results.affectedRows === 0) {
            return new NextResponse('User not found', { status: 404 });
        }

        return new NextResponse('User deleted successfully', { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
