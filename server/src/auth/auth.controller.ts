import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get(':provider/login')
  @UseGuards(AuthGuard())
  async login(@Param('provider') provider: string) {}

  @Get(':provider/callback')
  @UseGuards(AuthGuard())
  callback(@Req() req, @Res() res) {
    // Handle response, e.g. set session, JWT cookie, etc.
    res.redirect('/');
  }
}
