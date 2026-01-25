import { OAuthClientConfig } from '@/interfaces/auth.interface';
import { ConfigService } from '@/services/config.service';
import { Injectable, Logger } from '@nestjs/common';
import * as client from 'openid-client';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { OAuthSessionData } from '@/interfaces/auth.interface';
import { jwtVerify } from 'jose';

@Injectable()
export class OidcService {
  private readonly logger = new Logger(OidcService.name);
  public oidcProviders: OAuthClientConfig[] = [];
  private initialized: boolean = false;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async getOidcProviders() {
    if (!this.initialized) {
      this.oidcProviders = await this.createOidcClients();
      this.initialized = true;
    }
    return this.oidcProviders;
  }

  public async handleBackChannelLogout(
    providerName: string,
    logoutToken: string,
  ): Promise<void> {
    //get issuer from JWT token
    const providerClient = await this.getOidcProvider(providerName);
    if (!providerClient) {
      throw new Error(`Unknown provider: ${providerName}`);
    }
    const jwksCache = client.getJwksCache(providerClient.client);
    const jwksKey = jwksCache?.jwks?.keys[0];
    if (!jwksKey) {
      throw new Error('No JWKS keys found for provider');
    }
    const tokenSet = await jwtVerify(logoutToken, jwksKey);
    const sid = tokenSet.payload.sid as string;
    if (!sid) {
      throw new Error('No sid claim found in logout token');
    }
    this.logger.log(`Handle back-channel logout for sid: ${sid}`);
  }

  public async getOidcProvider(name: string) {
    this.oidcProviders = await this.getOidcProviders();
    return this.oidcProviders.find((p) => p.name === name);
  }

  private async createOidcClients(): Promise<OAuthClientConfig[]> {
    const providerConfigs = this.configService.getConfig().oauth;
    if (!providerConfigs) {
      return [];
    }

    const clients = await Promise.all(
      Object.entries(providerConfigs).map(async ([name, provider]) => {
        const configuration = await client.discovery(
          new URL(provider.issuerUrl),
          provider.clientId,
          provider.clientSecret,
        );

        return {
          name: name,
          client: configuration,
          scope: provider.scope,
          displayName: provider.displayName,
        } as OAuthClientConfig;
      }),
    );
    return clients;
  }

  async buildAuthorizationUrl(
    providerName: string,
  ): Promise<{ url: string; oauth: OAuthSessionData }> {
    const oidcProviders = await this.getOidcProviders();
    const providerClient = oidcProviders.find((p) => p.name === providerName);
    if (!providerClient) {
      throw new Error(`Unknown provider: ${providerName}`);
    }

    const code_verifier: string = client.randomPKCECodeVerifier();
    const code_challenge: string =
      await client.calculatePKCECodeChallenge(code_verifier);
    const redirectUri = `${this.configService.getConfig().websiteBaseUrl}/api/oauth/callback`;

    const parameters: Record<string, string> = {
      scope: providerClient.scope,
      redirect_uri: redirectUri,
      code_challenge,
      code_challenge_method: 'S256',
    };

    const oauth: OAuthSessionData = { code_verifier, provider: providerName };

    if (!providerClient.client.serverMetadata().supportsPKCE()) {
      parameters.state = client.randomState();
      oauth.state = parameters.state;
    }

    const url = client.buildAuthorizationUrl(providerClient.client, parameters);
    return { url: url.toString(), oauth };
  }

  async handleCallback(
    incUrl: string,
    oauth: OAuthSessionData,
  ): Promise<{ email: string; id: string; apiEnabled: boolean }> {
    const provider = oauth?.provider;
    if (!provider) {
      throw new Error('Provider not found in session');
    }

    const oidcProviders = await this.getOidcProviders();
    const providerClient = oidcProviders.find((p) => p.name === provider);
    if (!providerClient) {
      throw new Error('Unknown provider');
    }

    const currentUrl = new URL(
      incUrl,
      this.configService.getConfig().websiteBaseUrl,
    );

    // Remove state param if not used, otherwise openid-client throws error. Needed for Authentik
    const stateres = currentUrl.searchParams.get('state');
    if (!stateres) {
      currentUrl.searchParams.delete('state');
    }

    const tokens = await client.authorizationCodeGrant(
      providerClient.client,
      currentUrl,
      {
        pkceCodeVerifier: oauth.code_verifier,
        expectedState: oauth.state,
      },
    );
    const userEndpoint =
      providerClient.client.serverMetadata().userinfo_endpoint;

    if (!userEndpoint) {
      throw new Error('Userinfo endpoint not found in provider metadata');
    }
    // Fetch user info
    const protectedResourceResponse = await client.fetchProtectedResource(
      providerClient.client,
      tokens.access_token,
      new URL(userEndpoint),
      'GET',
    );

    const { email } = (await protectedResourceResponse.json()) as {
      email: string;
      name: string;
      picture?: string;
    };

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      apiEnabled: user.apiEnabled,
    };
  }
}
