// src/app/api/otp/send-otp/route.ts

import { NextResponse } from 'next/server';
import pool from '../../../../util/db'; // Importation par défaut de pool

async function insertOtp(phone: string, otp: string, expires: number): Promise<void> {

  console.log("-----------Step 1-----------")

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

export async function POST(request: Request) {
  const { phone } = await request.json();
  
  if (!phone) {
    return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
  }
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // OTP valide pendant 5 minutes

  try {
    await insertOtp(phone, otp, expires);
    console.log(`Sent OTP ${otp} to phone number ${phone}`);
    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error inserting OTP:', error);
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
  }
}
