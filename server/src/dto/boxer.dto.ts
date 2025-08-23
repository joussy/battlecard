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
} from 'class-validator';
import { Gender } from '@/interfaces/modality.interface';

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
  nbFights?: number;

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
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  /** Boxer first name */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  /** Boxer birth date (YYYY-MM-DD) */
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  /** Boxer club */
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @MaxLength(50)
  license: string;

  /** Boxer fight record */
  @IsNumber()
  @Min(0)
  fightRecord: number;
}
