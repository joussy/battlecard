import * as client from 'openid-client';
import 'express-session';

export interface OAuthClientConfig {
  name: string;
  client: client.Configuration;
  scope: string;
  callbackUrl: string;
  issuerUrl?: string;
}

interface OAuthSessionData {
  code_verifier?: string;
  state?: string;
  provider?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  apiEnabled: boolean;
}

declare module 'express-session' {
  interface SessionData {
    oauth?: OAuthSessionData;
    user: AuthenticatedUser;
  }
}
