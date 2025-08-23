import {
  ModalityErrorType,
  ModalityError,
} from '@/interfaces/modality.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ModalityErrorDao implements ModalityError {
  @IsEnum(ModalityErrorType)
  @ApiProperty({ enum: ModalityErrorType, enumName: 'ModalityErrorType' })
  type: ModalityErrorType;
}
