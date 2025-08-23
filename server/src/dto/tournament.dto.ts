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

/**
 * Tournament object returned from the API.
 */
export class GetTournamentDto {
  /** Unique tournament ID */
  id: string;
  /** Tournament name */
  name: string;
  /** User who created the tournament */
  userId: string;
  /** Tournament date (YYYY-MM-DD) */
  date: string;
  /** Tournament address (optional) */
  address?: string;
  /** Tournament zip code (optional) */
  zipCode?: string;
  /** Tournament city (optional) */
  city?: string;
  /** Formatted address combining street, city, and zipCode */
  formattedAddress?: string;
}
