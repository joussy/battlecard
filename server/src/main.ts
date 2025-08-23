import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: false,
    }),
  });
  app.setGlobalPrefix('/api');

  // Enable global validation with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are found
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );
  if (process.env.ENABLE_OPENAPI === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Battlecard')
      .setDescription('The Fightmaker App')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    writeFileSync('./openapi.json', JSON.stringify(documentFactory(), null, 2));
  }

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
