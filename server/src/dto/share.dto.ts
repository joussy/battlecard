import { Transform } from 'class-transformer';
import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class GenerateFightCardTokenDto {
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;
}

export class FightCardTokenDto {
  @IsString()
  @IsNotEmpty()
  fightCardToken: string;
}

export class DownloadOptionsDto {
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  displayQrCode: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  displayLicense: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  displayWeight: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  displayBirthdate: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  displayCategory: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  displayGender: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  displayDuration: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  displayTitle: boolean;
}

export class SelectorExportDto {
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;

  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  boxerIds: string[];
}

export class SimpleTournamentDto {
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;
}

export class GeneratedTokenDto {
  /** Token string */
  @IsString()
  token: string;

  /** QR code image data */
  @IsString()
  qrcode: string;

  /** Shareable URL */
  @IsString()
  url: string;
}
