import bcrypt from 'bcrypt';
import pool from '../../utils/db'; // Assurez-vous d'avoir une configuration db correcte pour `pool`.
import { RowDataPacket } from 'mysql2'; // Importation du type RowDataPacket

export const userService = {
  authenticate,
};

async function authenticate(email: string, password: string) {
  const connection = await pool.promise().getConnection();
  try {
    // Indiquez explicitement que `rows` est de type `RowDataPacket[]`
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      // Maintenant TypeScript sait que `rows` est un tableau de `RowDataPacket`
      const userFromDb = rows[0];  

      // Transformation de l'utilisateur de la base de données en un format plus utilisable
      const user = {
        id: userFromDb.uniqID, // Pas d'erreur car `userFromDb` est correctement typé
        name: `${userFromDb.firstname} ${userFromDb.lastname}`,
        email: userFromDb.email,
        passwordHash: userFromDb.password // On conserve le hash du mot de passe pour la vérification
      };
  
      // Vérification du mot de passe
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        console.log('Mot de passe incorrect.');
        return null; // Mot de passe incorrect
      }

      // Si tout va bien, retournez l'utilisateur (ou les données nécessaires seulement)
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } else {
      console.log('Aucun utilisateur trouvé avec cet email.');
      return null;
    }
  } finally {
    connection.release();
  }
}