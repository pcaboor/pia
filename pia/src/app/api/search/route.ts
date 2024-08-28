import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../utils/db';

export async function GET(req: NextRequest) {
    try {
        // Extraire la chaîne de requête et le tag
        const fullQuery = req.nextUrl.searchParams.get('query') || '';
        const [filterTag, searchQuery] = fullQuery.split('/', 2);

        // Si la chaîne de requête est vide ou mal formée, retourner une liste vide
        if (!searchQuery) {
            return new NextResponse(JSON.stringify([]), { status: 200 });
        }

        // Préparer la requête SQL en fonction du tag
        let searchQuerySQL = `
            SELECT uniqID, firstName, lastName, email, teamName, userImage 
            FROM users 
            WHERE `;
        
        let params: string[] = [];
        let likeQuery = `%${searchQuery}%`;

        switch (filterTag) {
            case 'email':
                searchQuerySQL += 'email LIKE ?';
                params.push(likeQuery);
                break;
            case 'firstname':
                searchQuerySQL += 'firstName LIKE ?';
                params.push(likeQuery);
                break;
            case 'lastname':
                searchQuerySQL += 'lastName LIKE ?';
                params.push(likeQuery);
                break;
            case 'teamName':
                searchQuerySQL += 'teamName LIKE ?';
                params.push(likeQuery);
                break;
            default:
                // Si aucun tag valide, ne pas filtrer
                searchQuerySQL += '(firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR teamName LIKE ?)';
                params = [likeQuery, likeQuery, likeQuery, likeQuery];
                break;
        }

        // Debugging information
        console.log('SQL Query:', searchQuerySQL);
        console.log('Params:', params);

        const [results] = await pool.promise().query(searchQuerySQL, params);

        if (results.length === 0) {
            console.warn('No results found for query:', searchQuery);
        }

        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (error) {
        console.error('Error fetching search results:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
