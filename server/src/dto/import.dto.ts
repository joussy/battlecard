import {
  IsBoolean,
  IsArray,
  IsUUID,
  IsNotEmpty,
  ValidateNested,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ImportBoxerDto } from './boxer.dto';
import { Gender } from '@/interfaces/modality.interface';
import { ApiProperty } from '@nestjs/swagger';

export class ImportBoxersDto {
  /** Whether this is a dry run */
  @IsBoolean()
  dry: boolean;

  /** Array of boxers to import */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportBoxerDto)
  boxers: ImportBoxerDto[];

  /** Tournament ID */
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;
}

export class PreviewBoxersApiDto {
  /** Payload containing boxer IDs */
  @IsString()
  @IsNotEmpty()
  payload: string;
}

export class PreviewBoxersCsvDto {
  /** CSV payload */
  @IsString()
  @IsNotEmpty()
  payload: string;
}

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
