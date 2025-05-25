import { ApiTournament } from '@/shared/types/api';
import { Tournament } from '../entities/tournament.entity';

export function toTournament(apiTournament: ApiTournament): Tournament {
  const tournament = new Tournament();
  tournament.id = apiTournament.id;
  tournament.name = apiTournament.name;
  tournament.userId = apiTournament.userId;
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
