import { Controller, Get, Req, Res, Param, UseGuards } from '@nestjs/common';
import * as client from 'openid-client';
import { Response as ExpressResponse, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { OidcConfigurationService } from './oidc-configuration.service';
import { NoAuthRequired } from '@/decorators/auth.decorator';
import { OAuthGuard } from './oauth.guard';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oidcConfigurationService: OidcConfigurationService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Get(':provider')
  @NoAuthRequired()
  async redirectToProvider(
    @Param('provider') provider: string,
    @Req() req: Request,
    @Res() res: ExpressResponse,
  ) {
    const oidcProviders =
      await this.oidcConfigurationService.getOidcProviders();
    const providerClient = oidcProviders.find((p) => p.name === provider);
    if (!providerClient) throw new Error('Unknown provider');
    const code_verifier: string = client.randomPKCECodeVerifier();
    const code_challenge: string =
      await client.calculatePKCECodeChallenge(code_verifier);

    const parameters: Record<string, string> = {
      scope: providerClient.scope,
      redirect_uri: `http://localhost:5173/api/oauth/callback`,
      code_challenge,
      code_challenge_method: 'S256',
    };
    req.session.oauth = { code_verifier, provider };
    if (!providerClient.client.serverMetadata().supportsPKCE()) {
      /**
       * We cannot be sure the server supports PKCE so we're going to use state too.
       * Use of PKCE is backwards compatible even if the AS doesn't support it which
       * is why we're using it regardless. Like PKCE, random state must be generated
       * for every redirect to the authorization_endpoint.
       */
      parameters.state = client.randomState();
      req.session.oauth.state = parameters.state;
    }

    const url = client.buildAuthorizationUrl(providerClient.client, parameters);
    return res.redirect(url.toString());
  }

  @Get('callback')
  @NoAuthRequired()
  @UseGuards(OAuthGuard)
  handleCallback(@Req() req: Request & { session: any }) {
    console.log('User info:', {
      email: req.session.email,
      name: req.session.name,
      picture: req.session.picture,
    });
    // Return HTML that posts the token to the opener and closes the popup
    return `<!DOCTYPE html>
<html><body>
<script>
  window.opener && window.opener.postMessage({ }, '*');
  window.close();
</script>
<p>Authentication successful. You can close this window.</p>
</body></html>`;
  }
}
