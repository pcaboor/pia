import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../utils/db';

export async function GET(req: NextRequest) {
    try {
        const fullQuery = req.nextUrl.searchParams.get('query') || '';
        const [filterTag, searchQuery] = fullQuery.split('/', 2);

        if (!searchQuery) {
            return new NextResponse(JSON.stringify([]), { status: 200 });
        }

        let searchQuerySQL = '';
        let params: string[] = [];
        let likeQuery = `%${searchQuery}%`;

        switch (filterTag) {
            case 'email':
                searchQuerySQL = `
                    SELECT uniqID AS id, firstName, lastName, email, teamName, userImage 
                    FROM users 
                    WHERE email LIKE ?
                `;
                params.push(likeQuery);
                break;
            case 'firstname':
                searchQuerySQL = `
                    SELECT uniqID AS id, firstName, lastName, email, teamName, userImage 
                    FROM users 
                    WHERE firstName LIKE ?
                `;
                params.push(likeQuery);
                break;
            case 'lastname':
                searchQuerySQL = `
                    SELECT uniqID AS id, firstName, lastName, email, teamName, userImage 
                    FROM users 
                    WHERE lastName LIKE ?
                `;
                params.push(likeQuery);
                break;
            case 'teamName':
                searchQuerySQL = `
                    SELECT uniqID AS id, firstName, lastName, email, teamName, userImage 
                    FROM users 
                    WHERE teamName LIKE ?
                `;
                params.push(likeQuery);
                break;
            case 'teams':
                searchQuerySQL = `
                    SELECT teamID AS id, teamName, team_picture AS team_picture
                    FROM teams
                    WHERE teamName LIKE ?
                `;
                params.push(likeQuery);
                break;
            default:
                searchQuerySQL = `
                    SELECT uniqID AS id, firstName, lastName, email, teamName, userImage 
                    FROM users 
                    WHERE (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR teamName LIKE ?)
                    UNION
                    SELECT teamID AS id, teamName, team_picture AS team_picture
                    FROM teams
                    WHERE teamName LIKE ?
                `;
                params = [likeQuery, likeQuery, likeQuery, likeQuery, likeQuery];
                break;
        }

        const [results] = await pool.promise().query(searchQuerySQL, params);

        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (error) {
        console.error('Error fetching search results:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
