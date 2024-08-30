import pool from "./db";

// Fonction pour insérer un OTP dans la base de données
export async function insertOtp(email: string, otp: string, expires: number): Promise<void> {
    console.log("Inserting OTP:", otp, "for email:", email, "with expiry:", expires);

    const connection = await pool.promise().getConnection();
    try {
      const insertQuery = `
        INSERT INTO otp_store (email, otp, expires)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires = VALUES(expires)
      `;
      await connection.query(insertQuery, [email, otp, expires]);
    } finally {
      connection.release();
    }
}

// Fonction pour obtenir un OTP depuis la base de données
export async function getOtp(email: string): Promise<{ otp: string; expires: number } | null> {
    console.log("Fetching OTP for email:", email);

    const connection = await pool.promise().getConnection();
    try {
      const selectQuery = 'SELECT otp, expires FROM otp_store WHERE email = ?';
      const [rows] = await connection.query(selectQuery, [email]);
      const result = rows as { otp: string; expires: number }[];
      return result.length > 0 ? result[0] : null;
    } finally {
      connection.release();
    }
}

// Fonction pour supprimer un OTP depuis la base de données
export async function deleteOtp(email: string): Promise<void> {
    console.log("Deleting OTP for email:", email);

    const connection = await pool.promise().getConnection();
    try {
      const deleteQuery = 'DELETE FROM otp_store WHERE email = ?';
      await connection.query(deleteQuery, [email]);
    } finally {
      connection.release();
    }
}
