import { Injectable, BadRequestException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class AuthService {

  private resend: Resend;

  constructor() {
    // ✅ ENV is available here

    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private otpStore = new Map<
    string,
    { otp: string; expires: number; data?: any }
  >();

  // ✅ Page 1
  async initiate(data: any) {
    return this.sendOtp(data.email, data);
  }

  // ✅ Send OTP
  async sendOtp(email: string, data?: any) {


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    this.otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      data,
    });

    console.log("Sending OTP:", otp);

    const response = await this.resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Register Portal Email Verification',
      html: `
        <h2>Email Verification</h2>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });


    return { message: 'OTP sent successfully' };
  }

  // ✅ Resend OTP
  async resendOtp(email: string) {
    return this.sendOtp(email);
  }

  // ✅ Verify OTP
verifyOtp(email: string, otp: string) {
  const record = this.otpStore.get(email);

  console.log("---- OTP VERIFY DEBUG ----");
  console.log("Email:", email);
  console.log("Received OTP:", otp);
  console.log("Stored Record:", record);

  if (!record) {
    throw new BadRequestException('OTP not found');
  }

  if (Date.now() > record.expires) {
    console.log("❌ OTP EXPIRED");
    throw new BadRequestException('OTP expired');
  }

  if (record.otp !== otp) {
    console.log("❌ OTP MISMATCH");
    console.log("Expected:", record.otp);
    throw new BadRequestException('Invalid OTP');
  }

  console.log("✅ OTP VERIFIED SUCCESS");

  this.otpStore.delete(email);

  return {
    message: 'Email verified successfully',
    userData: record.data,
  };
}
}
