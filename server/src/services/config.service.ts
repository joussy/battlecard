import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { homedir } from 'os';
import {
  AppConfig as FileConfig,
  EnvConfig,
} from '../interfaces/config.interface';

// This service manages application configuration
// It reads from a JSON file and ensures that the required properties are present,
// generating a new configuration if necessary.
@Injectable()
export class ConfigService {
  private fileConfig: FileConfig;
  private readonly configPath: string;
  private readonly logger = new Logger(ConfigService.name);
  private readonly envConfig: EnvConfig;
  private readonly config: EnvConfig & FileConfig;
  private readonly configDir: string;

  constructor() {
    // Load the configuration from the file on startup
    this.configDir = join(homedir(), '.config', 'battlecard');
    this.configPath = join(this.configDir, 'config.json');
    this.fileConfig = this.loadFileConfig();
    this.envConfig = this.loadEnvConfig();
    this.config = {
      ...this.envConfig,
      ...this.fileConfig,
    };
  }

  private loadEnvConfig(): EnvConfig {
    //check if required environment variables are set
    const requiredEnvVars = [
      'IMPORT_API_URL',
      'IMPORT_API_HEADER_X_API_KEY',
      'GOTENBERG_URL',
      'GOOGLE_CLIENT_ID',
      'WEBSITE_BASE_URL',
      'DB_HOST',
      'DB_PORT',
      'DB_USER',
      'DB_PASS',
      'DB_NAME',
      'JWT_SECRET',
      'GOOGLE_CALLBACK_URL',
      'GOOGLE_CLIENT_SECRET',
    ];
    requiredEnvVars.forEach((envVar) => {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    });
    return {
      importApiUrl: process.env.IMPORT_API_URL!,
      importApiHeaderXApiKey: process.env.IMPORT_API_HEADER_X_API_KEY!,
      gotenbergUrl: process.env.GOTENBERG_URL!,
      googleClientId: process.env.GOOGLE_CLIENT_ID!,
      websiteBaseUrl: process.env.WEBSITE_BASE_URL!,
      dbHost: process.env.DB_HOST!,
      dbPort: (() => {
        const port = parseInt(process.env.DB_PORT!, 10);
        if (isNaN(port)) {
          throw new Error(`Invalid DB_PORT value: ${process.env.DB_PORT}`);
        }
        return port;
      })(),
      dbUser: process.env.DB_USER!,
      dbPassword: process.env.DB_PASS!,
      dbName: process.env.DB_NAME!,
      jwtSecret: process.env.JWT_SECRET!,
      googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL!,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    };
  }

  private loadFileConfig(): FileConfig {
    if (existsSync(this.configPath)) {
      try {
        const configFile = readFileSync(this.configPath, 'utf8');
        const parsedConfig = JSON.parse(configFile) as FileConfig;

        // Validate that required properties exist
        if (!parsedConfig.fightCardShareSecret) {
          return this.generateAndSaveConfig();
        }
        this.logger.log(`Loaded config from ${this.configPath}`);
        return parsedConfig;
      } catch (error) {
        this.logger.warn(
          'Failed to parse config file, generating new one:',
          error,
        );
        this.logger.warn(
          'Failed to parse config file, generating new one:',
          error,
        );
        return this.generateAndSaveConfig();
      }
    } else {
      return this.generateAndSaveConfig();
    }
  }

  private generateAndSaveConfig(): FileConfig {
    if (!existsSync(this.configDir)) {
      mkdirSync(this.configDir, { recursive: true });
    }

    const newConfig: FileConfig = {
      fightCardShareSecret: this.generateSecret(),
    };

    try {
      writeFileSync(this.configPath, JSON.stringify(newConfig, null, 2));
      this.logger.log('Generated new config file at:', this.configPath);
    } catch (error) {
      this.logger.error('Failed to write config file:', error);
    }

    return newConfig;
  }

  private generateSecret(): string {
    return randomBytes(32).toString('hex');
  }

  getConfig(): EnvConfig & FileConfig {
    return this.config;
  }

  getFightCardShareSecret(): string {
    return this.fileConfig.fightCardShareSecret;
  }
}
