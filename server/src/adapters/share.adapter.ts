import { Tournament } from '@/entities/tournament.entity';
import { toApiFight } from './fight.adapter';
import { Fight } from '@/entities/fight.entity';
import { IModality } from '@/modality/IModality';
import { ApiSharedFightCardGet } from '@/shared/types/api';
import { SharedFightCardGetDto } from '@/dto/response.dto';

export function toApiSharedFightCardGet(
  tournament: Tournament,
  fights: Fight[],
  modality: IModality,
): ApiSharedFightCardGet {
  return {
    fights: fights.map((fight) => toApiFight(fight, modality)),
    tournamentName: tournament.name,
    tournamentDate: tournament.date,
  };
}

export function toSharedFightCardGetDto(
  tournament: Tournament,
  fights: Fight[],
  modality: IModality,
): SharedFightCardGetDto {
  return {
    fights: fights.map((fight) => toApiFight(fight, modality)),
    tournamentName: tournament.name,
    tournamentDate: tournament.date,
  };
}
