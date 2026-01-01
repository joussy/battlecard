import { Module, Global } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(),
    },
  ],
  exports: [ConfigService],
})
export class AppConfigModule {}
