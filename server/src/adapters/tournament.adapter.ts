import { ApiTournament, ApiTournamentCreate } from '@/shared/types/api';
import { Tournament } from '../entities/tournament.entity';

export function toTournament(
  apiTournament: ApiTournamentCreate,
  userId: string,
): Tournament {
  const tournament = new Tournament();
  tournament.name = apiTournament.name;
  tournament.userId = userId;
  tournament.date = apiTournament.date;
  return tournament;
}

export function toApiTournament(tournament: Tournament): ApiTournament {
  return {
    id: tournament.id,
    name: tournament.name,
    userId: tournament.userId,
    date: tournament.date,
  };
}
