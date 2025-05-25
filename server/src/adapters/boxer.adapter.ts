import { ApiBoxer } from '@/shared/types/api';
import { Boxer } from '../entities/boxer.entity';

export function toBoxer(apiBoxer: ApiBoxer): Boxer {
  const boxer = new Boxer();
  boxer.id = apiBoxer.id;
  boxer.lastName = apiBoxer.lastName;
  boxer.firstName = apiBoxer.firstName;
  boxer.birthDate = apiBoxer.birthDate;
  boxer.club = apiBoxer.club;
  boxer.weight = apiBoxer.weight;
  boxer.gender = apiBoxer.gender;
  boxer.license = apiBoxer.license;
  boxer.userId = apiBoxer.userId;
  boxer.created = apiBoxer.created;
  boxer.updated = apiBoxer.updated;
  return boxer;
}

export function toApiBoxer(boxer: Boxer): ApiBoxer {
  return {
    id: boxer.id,
    lastName: boxer.lastName,
    firstName: boxer.firstName,
    birthDate: boxer.birthDate,
    nbFights: boxer.nbFights,
    club: boxer.club,
    weight: boxer.weight,
    gender: boxer.gender,
    license: boxer.license,
    userId: boxer.userId,
    created: boxer.created,
    updated: boxer.updated,
  };
}
