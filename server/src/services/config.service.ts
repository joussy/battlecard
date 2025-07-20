import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { AppConfig } from '../interfaces/config.interface';

// This service manages application configuration
// It reads from a JSON file and ensures that the required properties are present,
// generating a new configuration if necessary.
@Injectable()
export class ConfigService {
  private config: AppConfig;
  private readonly configPath: string;
  private readonly logger = new Logger(ConfigService.name);
  constructor() {
    this.configPath = join(process.cwd(), '.config.json');
    // Load the configuration from the file on startup
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    if (existsSync(this.configPath)) {
      try {
        const configFile = readFileSync(this.configPath, 'utf8');
        const parsedConfig = JSON.parse(configFile) as AppConfig;

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

  private generateAndSaveConfig(): AppConfig {
    const newConfig: AppConfig = {
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

  getConfig(): AppConfig {
    return this.config;
  }

  getFightCardShareSecret(): string {
    return this.config.fightCardShareSecret;
  }
}
