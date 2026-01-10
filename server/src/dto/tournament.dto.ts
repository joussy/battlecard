import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  MaxLength,
  IsArray,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FightDto } from './fight.dto';

export class CreateTournamentDto {
  /** Tournament name */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  /** Tournament date (YYYY-MM-DD) */
  @IsDateString()
  @IsNotEmpty()
  date: string;

  /** Tournament address (optional) */
  @IsString()
  @MaxLength(200)
  address: string;

  /** Tournament zip code (optional) */
  @IsString()
  @MaxLength(10)
  @MinLength(0)
  zipCode: string;

  /** Tournament city (optional) */
  @IsString()
  @MaxLength(100)
  city: string;
  /** Additional info (optional) */
  @IsString()
  additionalInfo: string;
}

export class UpdateTournamentDto extends CreateTournamentDto {}

export class TournamentDto {
  /** Unique tournament ID */
  id: string;
  /** Tournament name */
  name: string;
  /** User who created the tournament */
  userId: string;
  /** Tournament date (YYYY-MM-DD) */
  date: string;
  /** Tournament address (optional) */
  address: string;
  /** Tournament zip code (optional) */
  zipCode: string;
  /** Tournament city (optional) */
  city: string;
  /** Formatted address combining street, city, and zipCode */
  formattedAddress?: string;
  /** Additional info (optional) */
  additionalInfo: string;
}

export class SharedFightCardDto {
  /** Tournament name */
  @IsString()
  tournamentName: string;

  /** Array of fights */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FightDto)
  fights: FightDto[];

  /** Tournament date (optional) */
  @IsOptional()
  @IsString()
  tournamentDate?: string;

  /** Additional info (optional) */
  @IsString()
  additionalInfo: string;

  @IsString()
  @IsOptional()
  address: string;
  @IsString()
  @IsOptional()
  zipCode: string;
  @IsString()
  @IsOptional()
  city: string;
}
