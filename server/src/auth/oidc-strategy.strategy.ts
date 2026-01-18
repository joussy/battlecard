import * as client from 'openid-client';
import { OAuthClientConfig } from '@/interfaces/auth.interface';
import passport from 'passport';
// openid-client/passport does not provide a direct ESM/TS import, so use require for runtime

import { StrategyPassport, VerifyFunction } from 'openid-client/build/passport';

export async function registerOidcStrategies(
  oidcProviders: OAuthClientConfig[],
) {
  for (const provider of oidcProviders) {
    // Discover issuer metadata, often you know the URL
    // You can either save it as part of your config, or discover dynamically if you know the well-known endpoint.
    // Here we assume you have the issuer_url somewhere in the config (add if not):
    //
    // provider.issuer_url: string <-- add to your OAuthClientConfig for best results

    const config = await client.discovery(
      new URL(provider.client.serverMetadata().issuer),
      provider.client.clientMetadata().client_id,
      provider.client.clientMetadata(),
    );
    // Use config for further operations

    const verify: VerifyFunction = (tokens, verified) => {
      verified(null, tokens.claims());
    };

    passport.use(
      provider.name,
      new StrategyPassport(
        {
          config,
          scope: provider.scope,
          //Callback URL should be set according to your application's routing,
        },
        verify,
      ),
    );
  }
}
