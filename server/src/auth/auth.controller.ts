import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { NoAuthRequired } from '@/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger(AuthController.name);

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @NoAuthRequired()
  async googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @NoAuthRequired()
  async googleAuthRedirect(
    @Req() req: { user: { email: string; name: string; picture?: string } },
  ) {
    this.logger.log('Google Auth Redirect:', req.user);
    // Handles the Google OAuth2 callback
    const { email, name, picture } = req.user;
    let user = await this.userRepository.findOneBy({ email });
    if (!user) {
      user = this.userRepository.create({ email, name, picture });
      await this.userRepository.save(user);
    }
    const token = await this.authService.generateJwt(user);
    // Return HTML that posts the token to the opener and closes the popup
    return `<!DOCTYPE html>
<html><body>
<script>
  window.opener && window.opener.postMessage({ token: '${token}' }, '*');
  window.close();
</script>
<p>Authentication successful. You can close this window.</p>
</body></html>`;
  }
}
