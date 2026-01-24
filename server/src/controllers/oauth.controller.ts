import {
  Controller,
  Get,
  Req,
  Param,
  UseGuards,
  Redirect,
} from '@nestjs/common';
import * as client from 'openid-client';
import { UserSession } from '@/decorators/auth.decorator';
import { OidcConfigurationService } from '../services/oidc-configuration.service';
import { NoAuthRequired } from '@/decorators/auth.decorator';
import { OAuthGuard } from '../guards/oauth.guard';
import {
  AuthenticatedUser,
  BattlecardSessionRequest,
} from '@/interfaces/auth.interface';
import { AvailableProvidersDto, OAuthLogoutDto } from '@/dto/oauth.dto';
import { ConfigService } from '@/services/config.service';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oidcConfigurationService: OidcConfigurationService,
    private readonly configService: ConfigService,
  ) {}

  @Get('callback')
  @NoAuthRequired()
  @UseGuards(OAuthGuard)
  @Redirect('/', 302)
  handleCallback(@UserSession() user: AuthenticatedUser) {
    console.log('User info:', user);
  }

  @NoAuthRequired()
  @Get('logout')
  async logout(@Req() req: BattlecardSessionRequest): Promise<OAuthLogoutDto> {
    const providerName = req.session?.user?.oauthProvider;
    req.session.destroy(() => {});

    // Optionally notify OIDC provider (end_session_endpoint)
    if (!providerName) {
      return { url: '/' };
    }
    const providerClient =
      await this.oidcConfigurationService.getOidcProvider(providerName);
    const endSessionEndpoint =
      providerClient?.client.serverMetadata().end_session_endpoint;

    if (endSessionEndpoint) {
      return { url: endSessionEndpoint };
    }
    return { url: '/' };
  }

  @NoAuthRequired()
  @Get('availableProviders')
  async getProviders(): Promise<AvailableProvidersDto> {
    const oidcProviders =
      await this.oidcConfigurationService.getOidcProviders();
    return {
      providers: oidcProviders.map((p) => p.name),
    };
  }

  @NoAuthRequired()
  @Get(':provider')
  async getRedirectionUrl(
    @Param('provider') provider: string,
    @Req() req: BattlecardSessionRequest,
  ) {
    const oidcProviders =
      await this.oidcConfigurationService.getOidcProviders();
    const providerClient = oidcProviders.find((p) => p.name === provider);
    if (!providerClient) throw new Error(`Unknown provider: ${provider}`);
    const code_verifier: string = client.randomPKCECodeVerifier();
    const code_challenge: string =
      await client.calculatePKCECodeChallenge(code_verifier);

    const parameters: Record<string, string> = {
      scope: providerClient.scope,
      redirect_uri: `${this.configService.getConfig().websiteBaseUrl}/api/oauth/callback`,
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
      req.session.oauth.provider = provider;
    }

    const url = client.buildAuthorizationUrl(providerClient.client, parameters);
    return url.toString();
  }
}
