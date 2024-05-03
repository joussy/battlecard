import { IModality } from "../fightModality/IModality";
import { ModalityError } from "./modality";

export interface Boxer {
  attributes: BoxerAttributes;
  opponents: Opponent[];
  collapsed: boolean;
}

export interface BoxerAttributes {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  weight: number;
  category: string;
  club: string;
  nbFights: number;
  gender: Gender;
}

export interface Opponent {
  boxer: Boxer;
  modalityErrors: ModalityError[];
  weightDifference: number;
  isEligible: boolean;
}

export enum Gender{
  FEMALE,
  MALE
}
export interface Fight {
  boxer1: Boxer;
  boxer2: Boxer;
  modalityErrors: ModalityError[];
}

export interface BoxingData {
  fightCard: Fight[];
  boxers: Boxer[];
  clipboard: string;
  modality: IModality;
  Gender: any;
  ModalityErrorType: any;
}

export interface BoxingStorage {
  boxers: BoxerAttributes[];
  fights: Map<number, number>[];
}

export interface ClubFighters {
  clubName: string;
  available: number;
  selected: number;
}