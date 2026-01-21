import { ConfigService } from '@/services/config.service';
import { Injectable } from '@nestjs/common';
import * as client from 'openid-client';
import { OAuthClientConfig } from '@/interfaces/auth.interface';
import passport from 'passport';
import {
  StrategyOptions,
  Strategy,
  VerifyFunction,
} from 'openid-client/passport';
import { OAuthProviderConfig } from '@/interfaces/config.interface';
@Injectable()
export class OidcConfigurationService {
  constructor(private readonly configService: ConfigService) {}
  public oidcProviders: OAuthClientConfig[] = [];

  public async registerOidcStrategies() {
    const appConfig = this.configService.getConfig();

    for (const providerName in appConfig.oauth) {
      const provider: OAuthProviderConfig = appConfig.oauth[providerName];

      const config = await client.discovery(
        new URL(provider.issuerUrl),
        provider.clientId,
        provider.clientSecret,
      );

      const verify: VerifyFunction = (
        tokens: client.TokenEndpointResponse &
          client.TokenEndpointResponseHelpers,
        verified: passport.AuthenticateCallback,
      ) => {
        const claims = tokens.claims();
        verified(null, null, claims);
      };
      const callbackUrl =
        appConfig.websiteBaseUrl.replace(/\/$/, '') +
        '/' +
        provider.callbackUrl.replace(/^\//, '');

      const strategyOptions: StrategyOptions = {
        config,
        scope: provider.scope,
        callbackURL: callbackUrl,
      };
      const strategy = new Strategy(strategyOptions, verify);

      passport.use(providerName, strategy);

      passport.serializeUser((user: Express.User, cb) => {
        cb(null, user);
      });

      passport.deserializeUser((user: Express.User, cb) => {
        return cb(null, user);
      });
    }
  }
}
