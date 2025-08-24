import { IsUUID, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

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

export class ExportWithQrCodeDto {
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;

  @IsBoolean()
  displayQrCode: boolean;
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
