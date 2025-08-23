import { IsUUID, IsNotEmpty, IsNumber, Min } from 'class-validator';

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
