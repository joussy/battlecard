import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class TournamentBoxerParamsDto {
  @IsUUID()
  tournamentId: string;

  @IsUUID()
  boxerId: string;
}

export class IdParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class TournamentIdParamsDto {
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;
}

export class FightCardTokenParamsDto {
  @IsString()
  @IsNotEmpty()
  fightCardToken: string;
}
