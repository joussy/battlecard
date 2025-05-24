import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @SetMetadata('isPublic', true)
  async googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @SetMetadata('isPublic', true)
  async googleAuthRedirect(
    @Req() req: { user: { email: string; name: string; picture?: string } },
  ) {
    console.log('Google Auth Redirect:', req.user);
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
