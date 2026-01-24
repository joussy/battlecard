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
  private readonly ENV_PREFIX = 'BATTLECARD_';

  constructor() {
    const fileConfig = this.loadFileConfig();
    const envConfig = this.loadEnvConfig();

    const conf = {
      ...fileConfig,
      ...envConfig,
    };
    const schema = this.getValidator();
    const result = schema.validate(conf, { abortEarly: false });
    if (result.error) {
      this.displayValidationErrors(result.error.details);
    } else {
      this.logger.log('Configuration validated successfully');
    }
    this.config = result.value;
  }

  /**
   * Display Joi validation errors in a user-friendly format and throw an error.
   */
  private displayValidationErrors(details: Joi.ValidationErrorItem[]): never {
    const formattedErrors = details
      .map((err, idx) => {
        const path = err.path.join('.');
        return `  ${idx + 1}. [${path}] ${err.message}`;
      })
      .join('\n');
    const errorMsg = [
      'Configuration validation failed with the following errors:',
      formattedErrors,
      '',
      'Please check your configuration file or environment variables and fix the above issues.',
      `If you are using environment variables, ensure they are prefixed with "${this.ENV_PREFIX}".`,
    ].join('\n');
    throw new Error(errorMsg);
  }

  private getValidator() {
    return Joi.object<EnvConfig>({
      geoapifyApiKey: Joi.string().optional(),
      dbHost: Joi.string().required(),
      dbPort: Joi.number().port().required(),
      dbUser: Joi.string().required(),
      dbPassword: Joi.string().required(),
      dbName: Joi.string().required(),
      jwtSecret: Joi.string().required(),
      importApiUrl: Joi.string().required(),
      importApiHeaderXApiKey: Joi.string().required(),
      gotenbergUrl: Joi.string().required(),
      websiteBaseUrl: Joi.string().required(),
      environment: Joi.string().valid('development', 'production'),
      enableOpenApi: Joi.boolean().default(false),
      port: Joi.number().port().default(3000),
      fightCardShareSecret: Joi.string().required().min(12),
      oauth: Joi.object()
        .pattern(
          Joi.string(),
          Joi.object({
            clientId: Joi.string().required(),
            clientSecret: Joi.string().required(),
            issuerUrl: Joi.string().required(),
            tokenUrl: Joi.string().required(),
            userInfoUrl: Joi.string().required(),
            scope: Joi.string().required(),
          }),
        )
        .optional(),
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
        const configFile = readFileSync(configPath, 'utf8');
        const parsedConfig = JSON.parse(configFile) as EnvConfig;

        return parsedConfig;
      } catch {
        this.logger.log(
          'Failed to parse config file, using environment variables',
        );
      }
    }
    return null;
  }
  private loadEnvConfig(): EnvConfig {
    const envVars = Object.fromEntries(
      Object.entries(process.env)
        .filter(
          ([key, value]) =>
            typeof value === 'string' && key.startsWith(this.ENV_PREFIX),
        )
        .map(([key, value]) => [key.substring(this.ENV_PREFIX.length), value]),
    ) as Record<string, string>;
    const env = unflatten(envVars);

    return env as EnvConfig;
  }
}
