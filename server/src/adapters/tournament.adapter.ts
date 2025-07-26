import { ApiTournament, ApiTournamentCreate } from '@/shared/types/api';
import { Tournament } from '../entities/tournament.entity';
import { format } from 'path';
import { formatAddress } from '@/utils/addressUtils';

export function toTournament(
  apiTournament: ApiTournamentCreate,
  userId: string,
): Tournament {
  const tournament = new Tournament();
  tournament.name = apiTournament.name;
  tournament.userId = userId;
  tournament.date = apiTournament.date;
  tournament.address = apiTournament.address;
  tournament.zipCode = apiTournament.zipCode;
  tournament.city = apiTournament.city;
  return tournament;
}

export function toApiTournament(tournament: Tournament): ApiTournament {
  return {
    id: tournament.id,
    name: tournament.name,
    userId: tournament.userId,
    date: tournament.date,
    address: tournament.address,
    zipCode: tournament.zipCode,
    city: tournament.city,
    formattedAddress: formatAddress({
      street: tournament.address,
      city: tournament.city,
      postcode: tournament.zipCode,
    }),
  };
}
