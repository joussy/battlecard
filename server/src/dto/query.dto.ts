import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  q: string;
}

export class TournamentIdQueryDto {
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;
}