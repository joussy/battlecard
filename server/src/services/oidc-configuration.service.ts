import { OAuthClientConfig } from '@/interfaces/auth.interface';
import { ConfigService } from '@/services/config.service';
import { Injectable } from '@nestjs/common';
import * as client from 'openid-client';

@Injectable()
export class OidcConfigurationService {
  constructor(private readonly configService: ConfigService) {}
  public oidcProviders: OAuthClientConfig[] = [];
  private initialized: boolean = false;

  public async getOidcProviders() {
    if (!this.initialized) {
      this.oidcProviders = await this.createOidcClients();
      this.initialized = true;
    }
    return this.oidcProviders;
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
        };
      }),
    );
    return clients;
  }
}
