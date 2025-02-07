import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Guard will handle the authentication
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    const values = await this.authService.login(req.user);

    const redirect = new URL(
      this.configService.get('FRONTEND_URL') + '/auth/callback',
    );

    redirect.searchParams.append('access_token', values.access_token);
    redirect.searchParams.append('user', JSON.stringify(values.user));

    return res.redirect(302, redirect.toString());
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {
    // Guard will handle the authentication
    return;
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Req() req, @Res() res) {
    const values = await this.authService.login(req.user);

    const redirect = new URL(
      this.configService.get('FRONTEND_URL') + '/auth/callback',
    );

    redirect.searchParams.append('access_token', values.access_token);
    redirect.searchParams.append('user', JSON.stringify(values.user));

    return res.redirect(302, redirect.toString());
  }
}
