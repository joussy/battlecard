import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class GenerateFightCardTokenDto {
  @IsUUID()
  @IsNotEmpty()
  tournamentId: string;
}

export class FightCardTokenDto {
  @IsString()
  @IsNotEmpty()
  fightCardToken: string;
}

export class FightCardTokenParamDto {
  @IsString()
  @IsNotEmpty()
  fightCardToken: string;
}
