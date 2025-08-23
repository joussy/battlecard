import { SharedFightCardGetDto, FightGetDto } from '@/dto/response.dto';
import { Tournament } from '../entities/tournament.entity';
import { Fight } from '../entities/fight.entity';
import { IModality } from '@/modality/IModality';
import { toFightGetDto } from './fight.adapter';
import { format } from 'date-fns';

export function toSharedFightCardGetDto(
  tournament: Tournament,
  fights: Fight[],
  modality: IModality,
): SharedFightCardGetDto {
  return {
    tournamentName: tournament.name,
    tournamentDate: tournament.date ? format(new Date(tournament.date), 'dd/MM/yyyy') : undefined,
    fights: fights.map((fight) => toFightGetDto(fight, modality)),
  };
}