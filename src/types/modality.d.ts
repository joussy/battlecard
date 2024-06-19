export interface ModalityError {
    type: ModalityErrorType
}

export enum ModalityErrorType {
    WEIGHT = 1,
    AGE = 2,
    SAME_CLUB = 3,
    SAME_ID = 4,
    OPPOSITE_GENDER = 5,
    PRIZE_LIST = 6,
}
