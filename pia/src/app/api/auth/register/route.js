import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '../../../../util/db';

// Fonction pour insérer un utilisateur
async function insertUser(user) {
  const connection = await pool.promise().getConnection();
  try {
    const insertQuery = `
      INSERT INTO users (uniqID, firstName, lastName, email, password, phone, company)
      VALUES (UUID(), ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(insertQuery, [
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.phone,
      user.company,
    ]);
  } finally {
    connection.release();
  }
}

export const POST = async (req) => {
  const user = await req.json();

  try {
    // Vérifier si l'email existe déjà
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const [emailExists] = await pool.promise().query(checkEmailQuery, [user.email]);

    if (emailExists.length > 0) {
      return new NextResponse(
        JSON.stringify({ message: 'Email already exists' }),
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // Insérer l'utilisateur dans la base de données
    await insertUser({
      ...user,
      password: hashedPassword
    });

    // Retourner une réponse indiquant que l'inscription est réussie et que l'OTP est envoyé
    return new NextResponse(
      JSON.stringify({ message: 'User registered successfully. Please verify your phone number.' }),
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in registration:', error);
    return new NextResponse(error.message, { status: 500 });
  }
};
