import { ApiFightGet } from '@/shared/types/api';
import { Fight } from '../entities/fight.entity';
import { FightDuration } from '@/shared/types/modality.type';
import { FightCardTemplate } from '@/interfaces/template.interface';
import { IModality } from '@/modality/IModality';
import { Tournament } from '@/entities/tournament.entity';
import { format } from 'date-fns';

export function toFight(apiFight: ApiFightGet): Fight {
  const fight = new Fight();
  fight.id = apiFight.id;
  fight.order = apiFight.order;
  fight.boxer1Id = apiFight.boxer1Id;
  fight.boxer2Id = apiFight.boxer2Id;
  fight.tournamentId = apiFight.tournamentId;
  return fight;
}

export function toApiFight(
  fight: Fight,
  fightDuration: FightDuration,
): ApiFightGet {
  return {
    id: fight.id,
    order: fight.order,
    boxer1Id: fight.boxer1Id,
    boxer2Id: fight.boxer2Id,
    tournamentId: fight.tournamentId,
    roundDurationAsSeconds: fightDuration.roundDurationAsSeconds,
    rounds: fightDuration.rounds,
  };
}

export function toFightCardTemplate(
  fights: Fight[],
  tournament: Tournament,
  modality: IModality,
): FightCardTemplate {
  const template: FightCardTemplate = {
    subtitle: format(tournament.date, 'dd/MM/yyyy'),
    title: tournament.name,
    fights: fights.map((fight) => {
      const duration = modality.getFightDuration(fight.boxer1, fight.boxer2);
      return {
        order: fight.order,
        boxer1License: fight.boxer1.license,
        boxer1FirstName: fight.boxer1.firstName,
        boxer1LastName: fight.boxer1.lastName,
        boxer1Club: fight.boxer1.club,
        boxer2License: fight.boxer2.license,
        boxer2Club: fight.boxer2.club,
        boxer2FirstName: fight.boxer2.firstName,
        boxer2LastName: fight.boxer2.lastName,
        fightDuration: `${duration.rounds}x${duration.roundDurationAsSeconds / 60}'`,
      };
    }),
  };
  return template;
}
