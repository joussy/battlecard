export interface ModalityError {
  type: ModalityErrorType;
}

export enum ModalityErrorType {
  WEIGHT = 1,
  AGE = 2,
  SAME_CLUB = 3,
  SAME_ID = 4,
  OPPOSITE_GENDER = 5,
  PRIZE_LIST = 6,
}

export interface FightDuration {
  rounds: number;
  roundDurationAsSeconds: number;
  restTimeAsSeconds: number;
}

export interface BeaCategory {
  name: string;
  shortName: string;
  roundDurationAsSeconds: number;
}
export enum ModalityErrorType {
  WEIGHT = 1,
  AGE = 2,
  SAME_CLUB = 3,
  SAME_ID = 4,
  OPPOSITE_GENDER = 5,
  PRIZE_LIST = 6,
}