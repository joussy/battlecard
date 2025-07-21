import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from './config.service';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.getConfig().dbHost,
      port: this.configService.getConfig().dbPort,
      username: this.configService.getConfig().dbUser,
      password: this.configService.getConfig().dbPassword,
      database: this.configService.getConfig().dbName,
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
      logging: false, // Set to true for debugging
    };
  }
}
