import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  // ✅ Page 1 — initiate registration + send OTP
  @Post('initiate')
  initiate(@Body() body: any) {
    return this.authService.initiate(body);
  }

  // ✅ Send OTP manually (optional)
  @Post('send-otp')
  sendOtp(@Body('email') email: string) {
    console.log("Sending OTP to:", email);


    return this.authService.sendOtp(email);
  }

  // ✅ Resend OTP
  @Post('resend-otp')
  resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }

  // ✅ Verify OTP (Page 2)
  @Post('verify-otp')
  verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    return this.authService.verifyOtp(email, otp);
  }
}
