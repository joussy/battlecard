import { IsUUID } from 'class-validator';

export class TournamentBoxerParamsDto {
  @IsUUID()
  tournamentId: string;

  @IsUUID()
  boxerId: string;
}
