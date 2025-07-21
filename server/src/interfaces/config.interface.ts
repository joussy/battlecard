// Configuration read at startup
export interface AppConfig {
  // Secret used for sharing fight cards
  fightCardShareSecret: string;
}

export interface EnvConfig {
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
  /** Google OAuth client ID for authentication */
  googleClientId: string;
  /** Google OAuth client secret for authentication */
  googleClientSecret: string;
  /** Google OAuth callback URL for authentication flow */
  googleCallbackUrl: string;

  // JWT configuration
  /** Secret key used for signing JWT tokens */
  jwtSecret: string;

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
}
