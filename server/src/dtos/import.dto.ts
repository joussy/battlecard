import { IsString, IsDate, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@/shared/types/modality.type';
import {
  ApiImportBoxer,
  ApiImportBoxersDto,
  ApiBoxerImportError,
  ApiImportBoxersResponse,
} from '@/shared/types/api';

export class ImportBoxerDto implements ApiImportBoxer {
  @IsString()
  name: string;

  @IsString()
  firstname: string;

  @IsDate()
  @Type(() => Date)
  birth_date: Date;

  @IsNumber()
  weight: number;

  @IsString()
  club: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  license: string;
}

export class ImportBoxersDto implements ApiImportBoxersDto {
  verify: boolean;
  @Type(() => ImportBoxerDto)
  boxers: ImportBoxerDto[];
}

export class BoxerImportErrorDto implements ApiBoxerImportError {
  message: string;
  row: number;
  field: string;
}

export class ImportBoxersResponseDto implements ApiImportBoxersResponse {
  success: boolean;
  message: string;
  errors?: BoxerImportErrorDto[];
}
