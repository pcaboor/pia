import pool from "../util/db";

export async function insertOtp(phone: string, otp: string, expires: number): Promise<void> {
    
    console.log("Inserting OTP:", otp, "for phone:", phone, "with expiry:", expires);
    

    const connection = await pool.promise().getConnection();
    try {
      const insertQuery = `
        INSERT INTO otp_store (phone, otp, expires)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires = VALUES(expires)
      `;
      await connection.query(insertQuery, [phone, otp, expires]);
    } finally {
      connection.release();
    }
  }
  
  // Fonction pour obtenir un OTP depuis la base de données
  export async function getOtp(phone: string): Promise<{ otp: string; expires: number } | null> {

    console.log("Fetching OTP for phone:", phone);

    const connection = await pool.promise().getConnection();
    try {
      const selectQuery = 'SELECT otp, expires FROM otp_store WHERE phone = ?';
      const [rows] = await connection.query(selectQuery, [phone]);
      // Cast `rows` to the expected type, here we assume it's an array of objects with otp and expires properties
      const result = rows as { otp: string; expires: number }[];
      return result.length > 0 ? result[0] : null;
    } finally {
      connection.release();
    }
  }
  /*
  // Fonction pour supprimer un OTP depuis la base de données
  export async function deleteOtp(phone: string): Promise<void> {

    console.log("Deleting OTP for phone:", phone);

    const connection = await pool.promise().getConnection();
    try {
      const deleteQuery = 'DELETE FROM otp_store WHERE phone = ?';
      await connection.query(deleteQuery, [phone]);
    } finally {
      connection.release();
    }
  }
*/