import { SharedFightCardDto } from '@/dto/tournament.dto';
import { Tournament } from '../entities/tournament.entity';
import { Fight } from '../entities/fight.entity';
import { IModality } from '@/modality/IModality';
import { toFightDto } from './fight.adapter';
import { format } from 'date-fns';

export function toSharedFightCardDto(
  tournament: Tournament,
  fights: Fight[],
  modality: IModality,
): SharedFightCardDto {
  return {
    tournamentName: tournament.name,
    tournamentDate: tournament.date
      ? format(new Date(tournament.date), 'dd/MM/yyyy')
      : undefined,
    fights: fights.map((fight) => toFightDto(fight, modality)),
  };
}
