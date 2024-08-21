import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import pool from '../../../../util/db';

// Bloquer l'accès au userdata par d'autres utilisateurs
async function authenticate(req: Request) {
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !token.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return token;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = params;
  if (auth.sub !== id) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
  }

  try {
    const query = 'SELECT * FROM users WHERE uniqID = ?';
    const [results] = await pool.promise().query(query, [id]);

    if (results.length === 0) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(results[0]), { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = params;
  if (auth.sub !== id) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
  }

  const { firstName, lastName, email, teamName } = await req.json();

  // Valider les données entrantes
  if (!firstName || !lastName || !email) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  const query = `
    UPDATE users SET firstName = ?, lastName = ?, email = ?, teamName = ?
    WHERE uniqID = ?`;

  try {
    const [results] = await pool.promise().query(query, [firstName, lastName, email, teamName, id]);

    if (results.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'User updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating user data:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = params;
  if (auth.sub !== id) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
  }

  const query = `DELETE FROM users WHERE uniqID = ?`;

  try {
    const [results] = await pool.promise().query(query, [id]);

    if (results.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
