/**
 * API types for the battlecard application.
 * These interfaces define the structure of data exchanged between frontend and backend.
 */

import { Gender, ModalityError } from './modality.type';

/**
 * Boxer returned from the API.
 */
export interface ApiBoxerGet {
  /** Unique boxer ID */
  id: string;
  /** Boxer's last name */
  lastName: string;
  /** Boxer's first name */
  firstName: string;
  /** Date of birth (YYYY-MM-DD) */
  birthDate: string;
  /** Number of past fights of the boxer */
  nbFights?: number;
  /** Club name */
  club: string;
  /** Weight in kg (optional) */
  weight?: number;
  /** Gender */
  gender: 'male' | 'female';
  /** License number */
  license: string;
  /** User who created this boxer */
  userId: string;
  /** Creation timestamp */
  created?: string;
  /** Update timestamp */
  updated?: string;
  /** Weight/age category */
  category: string;
  /** Short category label */
  categoryShort: string;
  /** Number of eligible fights (optional) */
  eligibleFights?: number;
  /** Number of fights selected for the fight card (optional) */
  selectedFights?: number;
}

/**
 * Opponent returned from the API, extends ApiBoxerGet.
 */
export interface ApiOpponentGet extends ApiBoxerGet {
  /** Difference in weight between main boxer and opponent */
  weightDifference: number;
  /** Whether this opponent is eligible for a fight */
  isEligible: boolean;
  /** Existing fight ID if a fight already exists */
  fightId?: string;
  /** Modality errors for this boxer */
  modalityErrors?: ModalityError[];
}

/**
 * Boxer creation payload.
 */
export interface ApiBoxerCreate {
  /** Last name */
  lastName: string;
  /** First name */
  firstName: string;
  /** Date of birth (YYYY-MM-DD) */
  birthDate: string;
  /** Number of fights (optional) */
  nbFights?: number;
  /** Club name */
  club: string;
  /** Weight in kg (optional) */
  weight?: number;
  /** Gender */
  gender: Gender;
  /** License number */
  license: string;
  /** Tournament ID (optional) */
  tournamentId?: string;
}

/**
 * Fight object returned from the API.
 */
export interface ApiFightGet {
  /** Fight order in the tournament */
  order: number;
  /** Unique fight ID */
  id: string;
  /** Red corner boxer ID */
  boxer1: ApiBoxerGet;
  /** Blue corner boxer ID */
  boxer2: ApiBoxerGet;
  /** Tournament ID */
  tournamentId: string;
  /** Fight duration in seconds */
  roundDurationAsSeconds: number;
  /** Rounds in the fight */
  rounds: number;
}

export interface ApiFightCreate {
  /** Red corner boxer ID */
  boxer1Id: string;
  /** Blue corner boxer ID */
  boxer2Id: string;
  /** Tournament ID */
  tournamentId: string;
  /** Fight order in the tournament */
  order: number;
}

/**
 * Tournament object returned from the API.
 */
export interface ApiTournament {
  /** Unique tournament ID */
  id: string;
  /** Tournament name */
  name: string;
  /** User who created the tournament */
  userId: string;
  /** Tournament date (YYYY-MM-DD) */
  date: string;
  /** Tournament address (optional) */
  address?: string;
  /** Tournament zip code (optional) */
  zipCode?: string;
  /** Tournament city (optional) */
  city?: string;
  /** Formatted address combining street, city, and zipCode */
  formattedAddress?: string;
}

export interface ApiTournamentCreate {
  /** Tournament name */
  name: string;
  /** Tournament date (YYYY-MM-DD) */
  date: string;
  /** Tournament address (optional) */
  address?: string;
  /** Tournament zip code (optional) */
  zipCode?: string;
  /** Tournament city (optional) */
  city?: string;
}

/**
 * Tournament-boxer association object.
 */
export interface ApiTournament_Boxer {
  /** Unique association ID */
  id: string;
  /** Tournament ID */
  tournamentId: string;
  /** Boxer ID */
  boxerId: string;
}

export interface ApiImportBoxer {
  /** Boxer name */
  lastName: string;
  /** Boxer first name */
  firstName: string;
  /** Boxer birth date (YYYY-MM-DD) */
  birthDate: string;
  /** Boxer club */
  club: string;
  /** Boxer weight */
  weight: number;
  /** Boxer gender */
  gender?: Gender;
  /** Boxer license */
  license: string;
  /** Boxer fight record */
  fightRecord: number;
}

export interface ApiImportBoxers {
  dry: boolean;
  boxers: ApiImportBoxer[];
  tournamentId: string;
}

export interface ApiBoxerImportError {
  message: string;
  row: number;
  field: string;
}

export interface ApiImportBoxersResponse {
  success: boolean;
  message: string;
  errors: ApiBoxerImportError[];
}

// PREVIEW

export interface ApiPreviewBoxersApi {
  payload: string;
}

export interface ApiPreviewBoxersCsv {
  payload: string;
}

export interface ApiPreviewBoxersResponse {
  success: boolean;
  message: string;
  boxers: ApiImportBoxer[];
}

export type CsvDelimiter = 'tab' | 'semi-column' | 'comma';

export function getCsvDelimiterFromType(delimiter: CsvDelimiter): string {
  switch (delimiter) {
    case 'tab':
      return '\t';
    case 'semi-column':
      return ';';
    case 'comma':
      return ',';
    default:
      throw new Error(`Unknown CSV delimiter type: ${delimiter as string}`);
  }
}

export interface ApiSharedFightCardGet {
  tournamentName: string;
  fights: ApiFightGet[];
  tournamentDate?: string;
}

export interface ApiGeneratedToken {
  token: string;
  qrcode: string;
  url: string;
}

export interface ApiAddressAutocompleteGet {
  city: string;
  street: string;
  zipCode: string;
  /**
   * Formatted address string combining street, city, and zipCode.
   */
  formatted: string;
}
