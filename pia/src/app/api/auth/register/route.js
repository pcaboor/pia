// src/app/api/auth/register/route.js

import { NextResponse } from 'next/server';
import util from 'util';
import bcrypt from 'bcrypt';
import db from '../../../../util/db';

const query = util.promisify(db.query).bind(db);

export const POST = async (req) => {
  const user = await req.json();

  try {
    // Vérifier si l'email existe déjà
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const emailExists = await query(checkEmailQuery, [user.email]);

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
    const insertQuery = `
      INSERT INTO users (uniqID, firstName, lastName, email, password, phone, company)
      VALUES (UUID(), ?, ?, ?, ?, ?, ?)
    `;
    const results = await query(insertQuery, [
      user.firstName,
      user.lastName,
      user.email,
      hashedPassword,
      user.phone,
      user.company,
    ]);

    if (results) return new NextResponse(JSON.stringify(user), { status: 201 });

  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
