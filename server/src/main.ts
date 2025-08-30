import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  await app.listen(process.env.PORT ?? 3000);

  // Once the server is listening, write the OpenAPI document to disk
  if (process.env.ENABLE_OPENAPI === 'true') {
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
}
void bootstrap();
