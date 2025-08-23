export enum Gender {
  FEMALE = 'female',
  MALE = 'male',
}

export enum ModalityErrorType {
  WEIGHT = 'WEIGHT',
  AGE = 'AGE',
  SAME_CLUB = 'SAME_CLUB',
  SAME_ID = 'SAME_ID',
  OPPOSITE_GENDER = 'OPPOSITE_GENDER',
  PRIZE_LIST = 'PRIZE_LIST',
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

export interface ModalityError {
  type: ModalityErrorType;
}
