import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { UserController } from './controllers/user.controller';
import { OAuthController } from './auth/oauth.controller';
import { TournamentController } from './controllers/tournament.controller';
import { Boxer } from './entities/boxer.entity';
import { BoxerController } from './controllers/boxer.controller';
import { Fight } from './entities/fight.entity';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import { FightController } from './controllers/fight.controller';
import { ExportController } from './controllers/export.controller';
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
import { AppConfigModule } from './app-config.module';
import { QrCodeService } from './services/qrcode.service';
import { TypeOrmConfigService } from './services/typeorm-config.service';
import { TemplateService } from './services/template.service';
import { PlacesController } from './controllers/places.controller';
import { PlacesService } from './services/places.service';
import { OidcConfigurationService } from './auth/oidc-configuration.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedOnlyGuard } from './guards/authenticated-only.guard';
import { Session } from './entities/session.entity';

@Module({
  imports: [
    AppConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppModule],
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([
      User,
      Tournament,
      Boxer,
      Fight,
      TournamentBoxer,
      Session,
    ]),
  ],
  controllers: [
    UserController,
    OAuthController,
    TournamentController,
    BoxerController,
    FightController,
    ExportController,
    ImportController,
    ShareController,
    PlacesController,
  ],
  providers: [
    TypeOrmConfigService,
    OidcConfigurationService,
    TypeOrmConfigService,
    ConfigService,
    FightService,
    TournamentService,
    BoxerService,
    ImportService,
    FightExportService,
    GotenbergService,
    SelectorExportService,
    ShareService,
    QrCodeService,
    TemplateService,
    ModalityService,
    PlacesService,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedOnlyGuard,
    },
  ],
  exports: [ModalityService],
})
export class AppModule {}
