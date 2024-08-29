// src/services/userService.ts
import bcrypt from 'bcrypt';
import pool from '../../utils/db'; // Assurez-vous d'avoir une configuration db correcte pour `pool`.

export const userService = {
  authenticate,
};

async function authenticate(email: string, password: string) {
  const connection = await pool.promise().getConnection();

  try {
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];

    if (!user) {
      return null; // Email non trouvé
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return null; // Mot de passe incorrect
    }

    // Retourner l'utilisateur avec les informations nécessaires pour la session
    return {
      id: user.uniqID,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };
  } finally {
    connection.release();
  }
}
