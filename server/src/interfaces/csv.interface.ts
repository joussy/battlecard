export interface CsvBoxer {
  /** Boxer name */
  lastName: string;
  /** Boxer first name */
  firstName: string;
  /** Boxer birth date (YYYY-MM-DD) */
  birthDate: string;
  /** Boxer club */
  club: string;
  /** Boxer weight */
  weight: string;
  /** Boxer gender */
  gender: string;
  /** Boxer license */
  license: string;
  /** Boxer fight record */
  fightRecord: string;
}

export const csvDelimiter = ';';

export const csvHeader = [
  'lastName',
  'firstName',
  'birthDate',
  'club',
  'weight',
  'gender',
  'license',
  'fightRecord',
] as string[];
