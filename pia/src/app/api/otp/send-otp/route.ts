import { NextRequest, NextResponse } from 'next/server';
import sendEmail from '../../email/email'; // Assurez-vous que cette fonction est bien importée
import { insertOtp } from '../../../../utils/otpStore'; // Vérifiez le chemin réel

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // OTP valide pendant 5 minutes

  try {
    await insertOtp(email, otp, expires); // Utiliser des e-mails

    // Envoi de l'OTP par e-mail
    
   // await sendEmail(otp, email, 'User'); // Nom de l'utilisateur à personnaliser
    
    const emailResult = await sendEmail(otp, email, 'User'); // Nom de l'utilisateur à personnaliser
    console.log("Email sent:", emailResult);
    
    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
  }
}
