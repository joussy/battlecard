import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { UserController } from './controllers/user.controller';
import { GoogleStrategy } from './auth/google.strategy';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { TournamentController } from './controllers/tournament.controller';
import { Boxer } from './entities/boxer.entity';
import { BoxerController } from './controllers/boxer.controller';
import { Fight } from './entities/fight.entity';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import { FightController } from './controllers/fight.controller';
import { ExternalServicesController } from './controllers/export.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ModalityService } from './modality/modality.service';
import { FightService } from './services/fight.service';
import { TournamentService } from './services/tournament.service';
import { BoxerService } from './services/boxer.service';
import { ImportController } from './controllers/import.controller';
import { ImportService } from './services/import.service';
import { FightExportService } from './services/fight-export.service';
import { GotenbergService } from './services/gotenberg.service';
import { SelectorExportService } from './services/selector-export.service';
import { ShareController } from './controllers/share.controller';
import { ShareService } from './services/share.service';
import { ConfigService } from './services/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'battlecard',
      autoLoadEntities: true,
      synchronize: true, // set to false in production!
    }),
    TypeOrmModule.forFeature([User, Tournament, Boxer, Fight, TournamentBoxer]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    UserController,
    AuthController,
    TournamentController,
    BoxerController,
    FightController,
    ExternalServicesController,
    ImportController,
    ShareController,
  ],
  providers: [
    GoogleStrategy,
    FightService,
    TournamentService,
    BoxerService,
    AuthService,
    ImportService,
    FightExportService,
    GotenbergService,
    SelectorExportService,
    ShareService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ModalityService,
    ConfigService,
  ],
  exports: [ModalityService, ConfigService],
})
export class AppModule {}
