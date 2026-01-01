import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ConsoleLogger,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './services/config.service';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import i18next from 'i18next';
import i18nMiddleware from './middleware/i18n.middleware';
// Import JSON translation files
import en from './locales/en-US.json';
import fr from './locales/fr-FR.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: false,
    }),
  });
  app.setGlobalPrefix('/api');

  // Initialize i18next for internationalization
  await i18next.init({
    fallbackLng: 'en',
    preload: ['en', 'fr'],
    resources: {
      en: { translation: en as object },
      fr: { translation: fr as object },
    },
    debug: false,
  });

  // Apply middleware to set i18next language from Accept-Language header
  app.use(i18nMiddleware);

  // Enable global validation with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are found
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.getConfig().port);
  const logger = new Logger(ConfigService.name);
  logger.log(
    `Battlecard Server is running on port ${configService.getConfig().port}`,
  );
  // Once the server is listening, write the OpenAPI document to disk
  if (configService.getConfig().enableOpenApi) {
    generateOpenApiSchema(app);
  } else {
    logger.log('OpenAPI generation is disabled.');
  }
}

/**
 * Generates the OpenAPI schema and writes it to a file.
 * @param app The NestJS application instance.
 */
function generateOpenApiSchema(app: INestApplication) {
  try {
    const outPath = './openapi.json';
    const config = new DocumentBuilder()
      .setTitle('Battlecard')
      .setDescription('The Fightmaker App')
      .setVersion('1.0')
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .build();

    const doc = SwaggerModule.createDocument(app, config);
    const newContent = JSON.stringify(doc, null, 2);

    if (existsSync(outPath)) {
      const oldContent = readFileSync(outPath, 'utf8');
      if (oldContent !== newContent) {
        console.log('OpenAPI document has changed; updating', outPath);
        writeFileSync(outPath, newContent);
      }
    } else {
      writeFileSync(outPath, newContent);
    }
  } catch (err) {
    // Don't fail startup if writing the file fails; log and continue
    console.error('Failed to write OpenAPI document:', err);
  }
}

void bootstrap();
