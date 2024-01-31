import { IModality } from "../fightModality/IModality";

export interface Boxer {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  opponents: number[];
  weight: number;
  category: string;
  club: string;
  collapsed: boolean;
  nbFights: number;
  gender: Gender;
}
export enum Gender{
  FEMALE,
  MALE
}
export interface Fight {
  boxer1: Boxer;
  boxer2: Boxer;
}

export interface BoxingData {
  fightCard: Fight[];
  boxers: Boxer[];
  clipboard: string;
  modality: IModality;
}