import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { homedir } from 'os';
import { AppConfig as FileConfig } from '../interfaces/config.interface';

// This service manages application configuration
// It reads from a JSON file and ensures that the required properties are present,
// generating a new configuration if necessary.
@Injectable()
export class ConfigSecretService {
  private readonly configPath: string;
  private readonly logger = new Logger(ConfigSecretService.name);
  private readonly config: FileConfig;
  private readonly configDir: string;

  constructor() {
    // Load the configuration from the file on startup
    this.configDir = join(homedir(), '.config', 'battlecard');
    this.configPath = join(this.configDir, 'secrets.json');
    this.config = this.loadFileConfig();
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
      this.logger.log('Writing config file at:', this.configPath);
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

  getConfig(): FileConfig {
    return this.config;
  }

  getFightCardShareSecret(): string {
    return this.config.fightCardShareSecret;
  }
}
