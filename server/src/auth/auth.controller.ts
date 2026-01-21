import { Controller, Get, Req, Res, Param } from '@nestjs/common';
import * as client from 'openid-client';
import { Response as ExpressResponse, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { OidcConfigurationService } from './oidc-configuration.service';
import { NoAuthRequired } from '@/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
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
      redirect_uri: `http://localhost:5173/api/auth/oauth/callback`,
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

  @Get('oauth/callback')
  @NoAuthRequired()
  async handleCallback(@Req() req: Request) {
    console.log('session:', req.session);
    if (!req.session.oauth) {
      throw new Error('Oauth data not found in session');
    }
    if (!req.session.oauth.provider) {
      throw new Error('Provider not found in session');
    }
    const oidcProviders =
      await this.oidcConfigurationService.getOidcProviders();
    const providerClient = oidcProviders.find(
      (p) => p.name === req.session.oauth!.provider,
    );
    if (!providerClient) throw new Error('Unknown provider');
    // Exchange code for tokens
    const tokens = await client.authorizationCodeGrant(
      providerClient.client,
      new URL(req.url, `http://${req.headers.host}`),
      {
        pkceCodeVerifier: req.session.oauth.code_verifier,
        expectedState: req.session.oauth.state,
      },
    );
    req.session.oauth = undefined;
    // Fetch user info
    const protectedResourceResponse = await client.fetchProtectedResource(
      providerClient.client,
      tokens.access_token,
      new URL(providerClient.client.serverMetadata().userinfo_endpoint!),
      'GET',
    );

    const { email, name, picture } =
      (await protectedResourceResponse.json()) as {
        email: string;
        name: string;
        picture?: string;
      };
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      //TODO: Decommenter les lignes du dessous
      throw new Error('User not found');
      // user = this.userRepository.create({ email, name, picture });
      // await this.userRepository.save(user);
    }
    req.session.user = {
      id: user.id,
      email: user.email,
      apiEnabled: user.apiEnabled,
    };
    console.log('User info:', { email, name, picture });
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
