import { NextResponse } from 'next/server';
import { getOtp } from '../../../../utils/otpStore';

export async function POST(request: Request) {
  const { phone, otp } = await request.json();

  if (!phone || !otp) {
    return NextResponse.json({ message: 'Phone number and OTP are required' }, { status: 400 });
  }

  try {
    const storedOtp = await getOtp(phone);

    if (!storedOtp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    if (storedOtp.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    if (Date.now() > storedOtp.expires) {
      return NextResponse.json({ message: 'Expired OTP' }, { status: 400 });
    }

    return NextResponse.json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ message: 'Failed to verify OTP' }, { status: 500 });
  }
}
