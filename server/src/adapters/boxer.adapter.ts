import { BoxerDto, OpponentDto } from '@/dto/boxer.dto';
import { ImportBoxerResponseDto } from '@/dto/import.dto';
import { Boxer } from '../entities/boxer.entity';
import { IModality } from '@/modality/IModality';
import { Gender, ModalityError } from '@/interfaces/modality.interface';
import { CsvBoxer } from '@/interfaces/csv.interface';
import { Tournament } from '@/entities/tournament.entity';
import { SelectorTemplate } from '@/interfaces/template.interface';
import { format } from 'date-fns/format';
import { CreateBoxerDto } from '@/dto/boxer.dto';

export function toBoxer(
  boxer: BoxerDto | CreateBoxerDto,
  userId: string,
): Boxer {
  const entity = new Boxer();
  entity.lastName = boxer.lastName;
  entity.firstName = boxer.firstName;
  entity.birthDate = boxer.birthDate;
  entity.nbFights = boxer.nbFights || 0;
  entity.club = boxer.club;
  entity.weight = boxer.weight;
  entity.gender = boxer.gender;
  entity.license = boxer.license;
  entity.userId = userId;
  return entity;
}

export function toBoxerDto(
  boxer: Boxer,
  modality: IModality,
  selectedFights?: number,
  eligibleFights?: number,
): BoxerDto {
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

export function toOpponentDto(
  boxer: Boxer,
  modality: IModality,
  selectedFights: number,
  modalityErrors: ModalityError[],
  fightId?: string,
): OpponentDto {
  return {
    ...toBoxerDto(boxer, modality),
    // modalityErrors: [], // Assuming modalityErrors is not available in Boxer entity
    weightDifference: 0, // Placeholder value, adjust as needed
    isEligible: true, // Placeholder value, adjust as needed
    fightId: fightId,
    selectedFights: selectedFights,
    modalityErrors: modalityErrors,
  };
}

export function toImportBoxerDto(csvBoxer: CsvBoxer): ImportBoxerResponseDto {
  const entry: ImportBoxerResponseDto = {
    lastName: csvBoxer.lastName,
    firstName: csvBoxer.firstName,
    gender:
      csvBoxer.gender === Gender.MALE.toString() ? Gender.MALE : Gender.FEMALE,
    weight: parseFloat(csvBoxer.weight) || 0,
    club: csvBoxer.club || '',
    birthDate: csvBoxer.birthDate || '',
    license: csvBoxer.license || '',
    fightRecord: parseInt(csvBoxer.fightRecord) || 0,
  };

  return entry;
}

export function toBattlecard(boxers: Boxer[]): CsvBoxer[] {
  return boxers.map((boxer) => ({
    lastName: boxer.lastName,
    firstName: boxer.firstName,
    birthDate: boxer.birthDate,
    club: boxer.club,
    weight: (boxer.weight ?? 0).toString(),
    gender: boxer.gender,
    license: boxer.license,
    fightRecord: boxer.nbFights.toString(),
  }));
}

export function toSelectorTemplate(
  boxers: Boxer[],
  tournament: Tournament,
  modality: IModality,
): SelectorTemplate {
  const template: SelectorTemplate = {
    subtitle: format(tournament.date, 'dd/MM/yyyy'),
    title: tournament.name,
    boxers: boxers.map((boxer) => {
      return {
        license: boxer.license,
        lastName: boxer.lastName,
        firstName: boxer.firstName,
        weight: boxer.weight,
        category: modality.getCategoryName(boxer, false),
        birthDate: format(boxer.birthDate, 'dd/MM/yyyy'),
        nbFights: `${boxer.nbFights}`,
        club: boxer.club,
        gender: boxer.gender === Gender.MALE ? '♂️' : '♀️',
      };
    }),
  };
  return template;
}

export function toSelectorExportData(boxers: Boxer[], modality: IModality) {
  return boxers.map((boxer) => ({
    License: boxer.license,
    LastName: boxer.lastName,
    FirstName: boxer.firstName,
    Weight: boxer.weight,
    Category: modality.getCategoryName(boxer, false),
    BirthDate: boxer.birthDate,
    NumberOfFights: boxer.nbFights,
    Club: boxer.club,
  }));
}
