import { TournamentDto } from '@/dto/response.dto';
import { CreateTournamentDto, UpdateTournamentDto } from '@/dto/tournament.dto';
import { Tournament } from '../entities/tournament.entity';
import { formatAddress } from '@/utils/addressUtils';

export function toTournamentDto(tournament: Tournament): TournamentDto {
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
      zipCode: tournament.zipCode,
    }),
  };
}

export function toTournament(
  tournament: TournamentDto,
  userId: string,
): Tournament {
  const entity = new Tournament();
  entity.id = tournament.id;
  entity.name = tournament.name;
  entity.userId = userId;
  entity.date = tournament.date;
  entity.address = tournament.address;
  entity.zipCode = tournament.zipCode;
  entity.city = tournament.city;
  return entity;
}

export function toTournamentFromCreateDto(
  tournament: CreateTournamentDto,
  userId: string,
): Tournament {
  const entity = new Tournament();
  entity.name = tournament.name;
  entity.userId = userId;
  entity.date = tournament.date;
  entity.address = tournament.address;
  entity.zipCode = tournament.zipCode;
  entity.city = tournament.city;
  return entity;
}

export function toTournamentFromUpdateDto(
  tournament: UpdateTournamentDto,
  userId: string,
): Tournament {
  const entity = new Tournament();
  entity.name = tournament.name;
  entity.userId = userId;
  entity.date = tournament.date;
  entity.address = tournament.address;
  entity.zipCode = tournament.zipCode;
  entity.city = tournament.city;
  return entity;
}
