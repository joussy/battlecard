import { ApiFight } from '@/shared/types/api';
import { Fight } from '../entities/fight.entity';
import { FightDuration } from '@/shared/types/modality.type';

export function toFight(apiFight: ApiFight): Fight {
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
): ApiFight {
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
