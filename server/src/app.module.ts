import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { UserController } from './user.controller';
import { GoogleStrategy } from './auth/google.strategy';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { TournamentController } from './tournament.controller';
import { Boxer } from './entities/boxer.entity';
import { BoxerController } from './boxer.controller';
import { Fight } from './entities/fight.entity';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import { FightController } from './fight.controller';
import { ExternalServicesController } from './external-services.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ModalityService } from './modality/modality.service';

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
  ],
  providers: [
    GoogleStrategy,
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ModalityService,
  ],
  exports: [ModalityService],
})
export class AppModule {}
