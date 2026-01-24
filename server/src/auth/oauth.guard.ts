import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import * as client from 'openid-client';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { OidcConfigurationService } from './oidc-configuration.service';

@Injectable()
export class OAuthGuard implements CanActivate {
  constructor(
    private readonly oidcConfigurationService: OidcConfigurationService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    if (req.session?.user) {
      console.log('User already authenticated', req.session);
      return true;
    }
    // If not authenticated, start OIDC flow
    const provider = req.params?.provider || req.session?.oauth?.provider;
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
        parameters.state = client.randomState();
        req.session.oauth.state = parameters.state;
      }
      const url = client.buildAuthorizationUrl(
        providerClient.client,
        parameters,
      );
      res.redirect(url.toString());
      return false;
    }
    // Handle callback and token exchange
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
      res.status(401).send('User not found');
      return false;
    }
    req.session.user = {
      id: user.id,
      email: user.email,
      apiEnabled: user.apiEnabled,
    };
    return true;
  }
}
