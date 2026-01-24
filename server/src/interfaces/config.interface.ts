// Configuration read at startup

/**
 * Configuration for a single OAuth provider (Google, GitHub, etc.)
 */
export interface OAuthProviderConfig {
  /** Client ID issued by the OAuth provider */
  clientId: string;
  /** Client secret issued by the OAuth provider */
  clientSecret: string;
  /** Authorization endpoint URL for initiating OAuth flow */
  issuerUrl: string;
  /** Token endpoint URL for exchanging code for access token */
  tokenUrl: string;
  /** User info endpoint URL for fetching authenticated user profile */
  userInfoUrl: string;
  /** Scopes requested during OAuth flow (space-separated) */
  scope: string;
}

export interface EnvConfig {
  /** Geoapify API key for address autocomplete. Optional */
  geoapifyApiKey?: string;
  // Database configuration
  /** PostgreSQL database host */
  dbHost: string;
  /** PostgreSQL database port */
  dbPort: number;
  /** PostgreSQL database username */
  dbUser: string;
  /** PostgreSQL database password */
  dbPassword: string;
  /** PostgreSQL database name */
  dbName: string;

  // Google OAuth configuration
  /** OAuth provider configurations (generic) */
  oauth?: Record<string, OAuthProviderConfig>;

  // JWT configuration
  /** Secret key used for signing Express cookies */
  sessionSecret: string;

  // External API configuration
  /** URL for the external import API service */
  importApiUrl: string;
  /** API key header value for the external import API */
  importApiHeaderXApiKey: string;
  /** URL for the Gotenberg PDF generation service */
  gotenbergUrl: string;

  // Application configuration
  /** Base URL of the website for generating links */
  websiteBaseUrl: string;
  /** Environment in which the application is running */
  environment: 'development' | 'production';
  /** Flag to enable or disable OpenAPI documentation */
  enableOpenApi: boolean;
  /** Port on which the application listens */
  port: number;
  /** Secret used for sharing fight cards */
  fightCardShareSecret: string;
}
