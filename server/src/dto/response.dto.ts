import {
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@/interfaces/modality.interface';

import { ApiProperty } from '@nestjs/swagger';
import { ModalityErrorDao } from './modality.dto';

export class BoxerImportErrorDto {
  /** Error message */
  @IsString()
  message: string;

  /** Row number where error occurred */
  @IsNumber()
  row: number;

  /** Field name that caused the error */
  @IsString()
  field: string;
}

export class ImportBoxersResponseDto {
  /** Whether the import was successful */
  @IsBoolean()
  success: boolean;

  /** Response message */
  @IsString()
  message: string;

  /** Array of import errors */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoxerImportErrorDto)
  errors: BoxerImportErrorDto[];
}

export class ImportBoxerResponseDto {
  /** Boxer name */
  @IsString()
  @MaxLength(50)
  lastName: string;

  /** Boxer first name */
  @IsString()
  @MaxLength(50)
  firstName: string;

  /** Boxer birth date (YYYY-MM-DD) */
  @IsString()
  birthDate: string;

  /** Boxer club */
  @IsString()
  @MaxLength(100)
  club: string;

  /** Boxer weight */
  @IsNumber()
  @Min(1)
  weight: number;

  /** Boxer gender */
  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender, enumName: 'Gender' })
  gender?: Gender;

  /** Boxer license */
  @IsString()
  @MaxLength(50)
  license: string;

  /** Boxer fight record */
  @IsNumber()
  @Min(0)
  fightRecord: number;
}

export class PreviewBoxersResponseDto {
  /** Whether the preview was successful */
  @IsBoolean()
  success: boolean;

  /** Response message */
  @IsString()
  message: string;

  /** Array of preview boxers */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportBoxerResponseDto)
  boxers: ImportBoxerResponseDto[];
}

export class BoxerGetDto {
  /** Unique boxer ID */
  @IsString()
  id: string;

  /** Boxer's last name */
  @IsString()
  @MaxLength(50)
  lastName: string;

  /** Boxer's first name */
  @IsString()
  @MaxLength(50)
  firstName: string;

  /** Date of birth (YYYY-MM-DD) */
  @IsString()
  birthDate: string;

  /** Number of past fights of the boxer */
  @IsOptional()
  @IsNumber()
  @Min(0)
  nbFights?: number;

  /** Club name */
  @IsString()
  @MaxLength(100)
  club: string;

  /** Weight in kg (optional) */
  @IsOptional()
  @IsNumber()
  @Min(1)
  weight?: number;

  /** Gender */
  @IsString()
  @ApiProperty({ enum: Gender, enumName: 'Gender' })
  gender: Gender;

  /** License number */
  @IsString()
  @MaxLength(50)
  license: string;

  /** User who created this boxer */
  @IsString()
  userId: string;

  /** Creation timestamp */
  @IsOptional()
  @IsString()
  created?: string;

  /** Update timestamp */
  @IsOptional()
  @IsString()
  updated?: string;

  /** Weight/age category */
  @IsString()
  category: string;

  /** Short category label */
  @IsString()
  categoryShort: string;

  /** Number of eligible fights (optional) */
  @IsOptional()
  @IsNumber()
  @Min(0)
  eligibleFights?: number;

  /** Number of fights selected for the fight card (optional) */
  @IsOptional()
  @IsNumber()
  @Min(0)
  selectedFights?: number;
}

export class FightGetDto {
  /** Fight order in the tournament */
  @IsNumber()
  @Min(1)
  order: number;

  /** Unique fight ID */
  @IsString()
  id: string;

  /** Red corner boxer */
  @ValidateNested()
  @Type(() => BoxerGetDto)
  boxer1: BoxerGetDto;

  /** Blue corner boxer */
  @ValidateNested()
  @Type(() => BoxerGetDto)
  boxer2: BoxerGetDto;

  /** Tournament ID */
  @IsString()
  tournamentId: string;

  /** Fight duration in seconds */
  @IsNumber()
  @Min(1)
  roundDurationAsSeconds: number;

  /** Rounds in the fight */
  @IsNumber()
  @Min(1)
  rounds: number;
}

export class SharedFightCardGetDto {
  /** Tournament name */
  @IsString()
  tournamentName: string;

  /** Array of fights */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FightGetDto)
  fights: FightGetDto[];

  /** Tournament date (optional) */
  @IsOptional()
  @IsString()
  tournamentDate?: string;
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

export class AddressAutocompleteGetDto {
  /** City name */
  @IsString()
  city: string;

  /** Street address */
  @IsString()
  street: string;

  /** ZIP code */
  @IsString()
  zipCode: string;

  /** Formatted address string */
  @IsString()
  formatted: string;
}

export class TournamentDto {
  /** Unique tournament ID */
  @IsString()
  id: string;

  /** Tournament name */
  @IsString()
  name: string;

  /** User who created the tournament */
  @IsString()
  userId: string;

  /** Tournament date (YYYY-MM-DD) */
  @IsString()
  date: string;

  /** Tournament address (optional) */
  @IsOptional()
  @IsString()
  address?: string;

  /** Tournament zip code (optional) */
  @IsOptional()
  @IsString()
  zipCode?: string;

  /** Tournament city (optional) */
  @IsOptional()
  @IsString()
  city?: string;

  /** Formatted address combining street, city, and zipCode */
  @IsOptional()
  @IsString()
  formattedAddress?: string;
}

export class OpponentGetDto extends BoxerGetDto {
  /** Difference in weight between main boxer and opponent */
  @IsNumber()
  weightDifference: number;

  /** Whether this opponent is eligible for a fight */
  @IsBoolean()
  isEligible: boolean;

  /** Existing fight ID if a fight already exists */
  @IsOptional()
  @IsString()
  fightId?: string;

  /** Modality errors for this boxer */
  @IsOptional()
  @IsArray()
  modalityErrors?: ModalityErrorDao[];
}
