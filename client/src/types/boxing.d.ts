import { IModality } from "../fightModality/IModality"
import { ModalityError } from "./modality"

export interface Boxer {
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
    userId: string
    category: string
    categoryShort: string
    eligibleFights?: number
    selectedFights?: number
}

export interface Opponent extends Boxer {
    modalityErrors: Readonly<ModalityError[]>
    weightDifference: number
    isEligible: boolean
    fightId?: string
}

export enum Gender {
    FEMALE,
    MALE,
}
export interface Fight {
    boxer1Id: string
    boxer2Id: string
    modalityErrors: Readonly<ModalityError[]>
    id: string
    order: number
    tournamentId: string
    roundDurationSeconds: number
    rounds: number
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

export interface Tournament {
    id: string
    name: string
    userId: string
    date: string
}
