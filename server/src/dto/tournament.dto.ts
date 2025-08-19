import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  MaxLength,
} from 'class-validator';

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
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  /** Tournament zip code (optional) */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  zipCode?: string;

  /** Tournament city (optional) */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;
}

export class UpdateTournamentDto extends CreateTournamentDto {}
