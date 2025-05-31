import { ApiTournament_Boxer } from '@/shared/types/api';
import { TournamentBoxer } from '../entities/tournament_boxer.entity';

export function toTournamentBoxer(
  apiTournamentBoxer: ApiTournament_Boxer,
): TournamentBoxer {
  const tournamentBoxer = new TournamentBoxer();
  tournamentBoxer.id = apiTournamentBoxer.id;
  tournamentBoxer.tournamentId = apiTournamentBoxer.tournamentId;
  tournamentBoxer.boxerId = apiTournamentBoxer.boxerId;
  return tournamentBoxer;
}

export function toApiTournamentBoxer(
  tournamentBoxer: TournamentBoxer,
): ApiTournament_Boxer {
  return {
    id: tournamentBoxer.id,
    tournamentId: tournamentBoxer.tournamentId,
    boxerId: tournamentBoxer.boxerId,
  };
}
