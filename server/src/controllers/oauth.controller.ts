import {
  Controller,
  Get,
  Req,
  Param,
  Redirect,
  Logger,
  Res,
  Post,
  Body,
} from '@nestjs/common';
import { OidcService } from '../services/oidc.service';
import { NoAuthRequired } from '@/decorators/auth.decorator';
import { BattlecardSessionRequest } from '@/interfaces/auth.interface';
import { AvailableProvidersDto, OAuthLogoutDto } from '@/dto/oauth.dto';
import { ConfigService } from '@/services/config.service';
import { Response as ExpressResponse, Request } from 'express';

@Controller('oauth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly oidcConfigurationService: OidcService,
    private readonly configService: ConfigService,
  ) {}

  @Get('callback')
  @NoAuthRequired()
  @Redirect('/', 302)
  async handleCallback(
    @Req() req: Request,
    @Res() res: ExpressResponse,
  ): Promise<boolean> {
    if (req.session?.user) {
      this.logger.debug('User already authenticated', req.session.user);
      return true;
    }
    // If not authenticated, start OIDC flow
    const provider = req.session?.oauth?.provider;
    if (!provider) {
      res.status(401).send('Provider not specified');
      return false;
    }
    const oidcProviders =
      await this.oidcConfigurationService.getOidcProviders();
    const providerClient = oidcProviders.find((p) => p.name === provider);
    if (!providerClient) {
      res.status(401).send('Unknown provider');
      return false;
    }
    if (!req.session.oauth) {
      // Start OIDC redirect
      try {
        const { url, oauth } =
          await this.oidcConfigurationService.buildAuthorizationUrl(provider);
        req.session.oauth = oauth;
        res.redirect(url);
        return false;
      } catch (err) {
        this.logger.error('Failed to build authorization URL:', err);
        res.status(500).send('Failed to initialize authentication');
        return false;
      }
    }
    // Handle callback and token exchange
    const protocol = req.secure ? 'https' : 'http';
    const currentUrl = new URL(
      req.originalUrl || req.url,
      `${protocol}://${req.headers.host}`,
    );

    try {
      const userData = await this.oidcConfigurationService.handleCallback(
        currentUrl,
        req.session.oauth,
      );
      req.session.oauth = undefined;
      req.session.user = {
        ...userData,
        oauthProvider: provider,
      };
      return true;
    } catch (err) {
      this.logger.error('Authentication failed:', err);
      res.status(401).send('Authentication failed');
      return false;
    }
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
  @Post('backchannel-logout/:provider')
  async backChannelLogout(
    @Body() body: { logout_token: string },
    @Param('provider') provider: string,
  ): Promise<void> {
    console.log(
      `Received back-channel logout for provider: ${provider}: ${body.logout_token}`,
    );
    await this.oidcConfigurationService.handleBackChannelLogout(
      provider,
      body.logout_token,
    );
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
    @Req() req: Request,
  ) {
    const { url, oauth } =
      await this.oidcConfigurationService.buildAuthorizationUrl(provider);
    req.session.oauth = oauth;
    return url;
  }
}
