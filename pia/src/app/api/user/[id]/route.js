import { NextResponse } from 'next/server';
import pool from '../../../../util/db';

export async function GET(req, { params }) {
  const { id } = params;

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

export async function PUT(req, { params }) {
  const { id } = params;
  const { firstName, lastName, email, teamName } = await req.json();

  // Valider les données entrantes
  if (!firstName || !lastName || !email) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  // Requête SQL pour mettre à jour les informations de l'utilisateur
  const query = `
    UPDATE users
    SET firstName = ?, lastName = ?, email = ?, teamName = ?
    WHERE uniqID = ?
  `;

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

export async function DELETE(req, { params }) {
  const { id } = params;

  const query = `DELETE FROM users WHERE uniqID = ?`;

  try {
    const [results] = await pool.promise().query(query, [id]);

    if (results.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating user data:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
