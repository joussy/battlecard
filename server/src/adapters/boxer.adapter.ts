import {
  ApiBoxerCreate,
  ApiBoxerGet,
  ApiOpponentGet,
} from '@/shared/types/api';
import { Boxer } from '../entities/boxer.entity';
import { IModality } from '@/modality/IModality';
import { ModalityError } from '@/shared/types/modality.type';
import { CsvBoxer } from '@/interfaces/csv.interface';

export function toBoxer(apiBoxer: ApiBoxerCreate, userId: string): Boxer {
  const boxer = new Boxer();
  boxer.lastName = apiBoxer.lastName;
  boxer.firstName = apiBoxer.firstName;
  boxer.birthDate = apiBoxer.birthDate;
  boxer.club = apiBoxer.club;
  boxer.weight = apiBoxer.weight;
  boxer.gender = apiBoxer.gender;
  boxer.license = apiBoxer.license;
  boxer.userId = userId;
  return boxer;
}

export function toApiBoxerGet(
  boxer: Boxer,
  modality: IModality,
  selectedFights?: number,
  eligibleFights?: number,
): ApiBoxerGet {
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
    category: modality.getCategoryName(boxer, false),
    categoryShort: modality.getCategoryName(boxer, true),
    selectedFights: selectedFights,
    eligibleFights: eligibleFights,
  };
}

export function toApiOpponentGet(
  boxer: Boxer,
  modality: IModality,
  selectedFights: number,
  modalityErrors: ModalityError[],
  fightId?: string,
): ApiOpponentGet {
  return {
    ...toApiBoxerGet(boxer, modality),
    // modalityErrors: [], // Assuming modalityErrors is not available in Boxer entity
    weightDifference: 0, // Placeholder value, adjust as needed
    isEligible: true, // Placeholder value, adjust as needed
    fightId: fightId,
    selectedFights: selectedFights,
    modalityErrors: modalityErrors,
  };
}

export function toCsvBoxer(boxer: Boxer): CsvBoxer {
  return {
    lastName: boxer.lastName,
    firstName: boxer.firstName,
    birthDate: boxer.birthDate,
    club: boxer.club,
    weight: boxer.weight ?? 0,
    gender: boxer.gender,
    license: boxer.license,
    fightRecord: boxer.nbFights,
  };
}
