import * as client from 'openid-client';
import 'express-session';
import { SessionData } from 'express-session';

export interface OAuthClientConfig {
  name: string;
  client: client.Configuration;
  scope: string;
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
  oauthProvider?: string;
}

declare module 'express-session' {
  interface SessionData {
    oauth?: OAuthSessionData;
    user: AuthenticatedUser;
  }
}

export type BattlecardSessionRequest = Express.Request & {
  session: SessionData;
};
