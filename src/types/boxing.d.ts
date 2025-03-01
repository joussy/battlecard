import { IModality } from "../fightModality/IModality"
import { ModalityError } from "./modality"

export interface Boxer {
    attributes: BoxerAttributes
    opponents: Readonly<Opponent[]>
    collapsed: boolean
}

export interface BoxerAttributes {
    id: string
    firstName: string
    lastName: string
    birthDate: Date
    weight: number
    category: string
    categoryShortText: string
    club: string
    nbFights: number
    gender: Gender
    license: string
}

export interface Opponent {
    boxer: Boxer
    modalityErrors: Readonly<ModalityError[]>
    weightDifference: number
    isEligible: boolean
}

export enum Gender {
    FEMALE,
    MALE,
}
export interface Fight {
    boxer1: Boxer
    boxer2: Boxer
    modalityErrors: ModalityError[]
}

export interface BoxingData {
    fightCard: Fight[]
    boxers: Boxer[]
    clipboard: string
    modality: IModality
    Gender: Gender
    ModalityErrorType: ModalityErrorType
}

export interface BoxingStorage {
    boxers: BoxerAttributes[]
    fights: Map<number, number>[]
}

export interface ClubFighters {
    clubName: string
    available: number
    selected: number
}

export interface FightStore {
    fightCard: Fight[]
    boxers: Boxer[]
    modality: IModality
    getBoxerDisplayName(boxer: Boxer): string
    removeFromFightCardByIndex(index: number): void
    getOpponentModalityErrors(boxer: Boxer, opponent: Boxer): ModalityError[]
}
