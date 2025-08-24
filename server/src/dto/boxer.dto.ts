import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
  MaxLength,
  Min,
  IsUUID,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Gender } from '@/interfaces/modality.interface';
import { ModalityErrorDao } from './modality.dto';

import { ApiProperty } from '@nestjs/swagger';

export class CreateBoxerDto {
  /** Last name */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  /** First name */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  /** Date of birth (YYYY-MM-DD) */
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  /** Number of fights (optional) */
  @IsOptional()
  @IsNumber()
  @Min(0)
  nbFights: number;

  /** Club name */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  club: string;

  /** Weight in kg (optional) */
  @IsOptional()
  @IsNumber()
  @Min(1)
  weight?: number;

  /** Gender */
  @IsEnum(Gender)
  @IsNotEmpty()
  @ApiProperty({ enum: Gender, enumName: 'Gender' })
  gender: Gender;

  /** License number */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  license: string;

  /** Tournament ID (optional) */
  @IsOptional()
  @IsUUID()
  tournamentId?: string;
}

export class UpdateBoxerDto extends CreateBoxerDto {}

export class ImportBoxerDto {
  /** Boxer name */
  @IsString()
  @IsOptional()
  lastName: string;

  /** Boxer first name */
  @IsString()
  @IsOptional()
  firstName: string;

  /** Boxer birth date (YYYY-MM-DD) */
  @IsDateString()
  @IsOptional()
  birthDate: string;

  /** Boxer club */
  @IsOptional()
  @IsString()
  club: string;

  /** Boxer weight */
  @IsNumber()
  @IsOptional()
  weight: number;

  /** Boxer gender */
  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender, enumName: 'Gender' })
  gender?: Gender;

  /** Boxer license */
  @IsOptional()
  @IsString()
  license: string;

  /** Boxer fight record */
  @IsOptional()
  @IsNumber()
  fightRecord: number;
}

export class BoxerDto {
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

export class OpponentDto extends BoxerDto {
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
