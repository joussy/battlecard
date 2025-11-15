import { Injectable, Logger } from '@nestjs/common';
import { EnvConfig } from '../interfaces/config.interface';
import { unflatten } from 'flat';
import Joi from 'joi';
import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

@Injectable()
export class ConfigService {
  private readonly configPath: string;
  private readonly logger = new Logger(ConfigService.name);
  private readonly config: EnvConfig;

  constructor() {
    const fileConfig = this.loadFileConfig();
    const envConfig = this.loadEnvConfig();

    const conf = {
      ...fileConfig,
      ...envConfig,
    };

    const schema = this.GetValidator();
    const result = schema.validate(conf);
    if (result.error) {
      this.logger.error('Validation failed:', result.error.details);
      throw new Error('Invalid configuration');
    }
    this.config = result.value;
    console.log(this.config);
  }

  private GetValidator() {
    return Joi.object<EnvConfig>({
      geoapifyApiKey: Joi.string().optional(),
      dbHost: Joi.string().required(),
      dbPort: Joi.number().required(),
      dbUser: Joi.string().required(),
      dbPassword: Joi.string().required(),
      dbName: Joi.string().required(),
      googleClientId: Joi.string().required(),
      googleClientSecret: Joi.string().required(),
      googleCallbackUrl: Joi.string().required(),
      jwtSecret: Joi.string().required(),
      importApiUrl: Joi.string().required(),
      importApiHeaderXApiKey: Joi.string().required(),
      gotenbergUrl: Joi.string().required(),
      websiteBaseUrl: Joi.string().required(),
      environment: Joi.string().valid('development', 'production'),
      enableOpenApi: Joi.bool().default(false),
      port: Joi.number().default(3000),
    });
  }

  getConfig(): EnvConfig {
    return this.config;
  }

  private loadFileConfig(): EnvConfig | null {
    const configDir = join(homedir(), '.config', 'battlecard');
    const configPath = join(configDir, 'config.json');

    if (existsSync(configPath)) {
      try {
        const configFile = readFileSync(this.configPath, 'utf8');
        const parsedConfig = JSON.parse(configFile) as EnvConfig;

        return parsedConfig;
      } catch {
        this.logger.log('No config file found, using environment variables');
      }
    }
    return null;
  }
  private loadEnvConfig(): EnvConfig {
    const ENV_PREFIX = 'BATTLECARD_';
    const envVars = Object.fromEntries(
      Object.entries(process.env)
        .filter(
          ([key, value]) =>
            typeof value === 'string' && key.startsWith(ENV_PREFIX),
        )
        .map(([key, value]) => [key.substring(ENV_PREFIX.length), value]),
    ) as Record<string, string>;

    const env = unflatten(envVars);

    return env as EnvConfig;
  }
}
