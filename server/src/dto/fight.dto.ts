import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BoxerDto } from './boxer.dto';

export class CreateFightDto {
  /** Red corner boxer ID */
  @IsUUID()
  @IsNotEmpty()
  boxer1Id: string;

  /** Blue corner boxer ID */
  @IsUUID()
  @IsNotEmpty()
  boxer2Id: string;

  /** Tournament ID */
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;

  /** Fight order in the tournament */
  @IsNumber()
  @Min(1)
  order: number;
}

export class ReorderFightDto {
  /** Fight ID to reorder */
  @IsUUID()
  @IsNotEmpty()
  fightId: string;

  /** New index for the fight */
  @IsNumber()
  @Min(0)
  newIndex: number;
}

export class SwitchFightDto {
  /** Fight ID to switch boxers */
  @IsUUID()
  @IsNotEmpty()
  fightId: string;
}

export class DeleteFightsDto {
  /** Array of fight IDs to delete */
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  ids: string[];
}

export class FightDto {
  /** Fight order in the tournament */
  @IsNumber()
  @Min(1)
  order: number;

  /** Unique fight ID */
  @IsString()
  id: string;

  /** Red corner boxer */
  @ValidateNested()
  @Type(() => BoxerDto)
  boxer1: BoxerDto;

  /** Blue corner boxer */
  @ValidateNested()
  @Type(() => BoxerDto)
  boxer2: BoxerDto;

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
