import {
  IsBoolean,
  IsArray,
  IsUUID,
  IsNotEmpty,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ImportBoxerDto } from './boxer.dto';

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
