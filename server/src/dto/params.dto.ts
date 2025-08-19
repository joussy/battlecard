import { IsUUID } from 'class-validator';

export class UuidParamDto {
  @IsUUID()
  id: string;
}

export class TournamentIdParamDto {
  @IsUUID()
  tournamentId: string;
}

export class BoxerIdParamDto {
  @IsUUID()
  boxerId: string;
}

export class TournamentBoxerParamsDto {
  @IsUUID()
  tournamentId: string;

  @IsUUID()
  boxerId: string;
}
