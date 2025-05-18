import { BoxerAttributes } from "../types/boxing"
import { FightDuration, ModalityError } from "../types/modality"

export interface IModality {
    isEligible(boxer1: BoxerAttributes, boxer2: BoxerAttributes): boolean
    getModalityProblems(boxer1: BoxerAttributes, boxer2: BoxerAttributes): ModalityError[]
    getCategoryName(boxer: BoxerAttributes, shortText: boolean): string
    getFightDuration(boxer1: BoxerAttributes, boxer2: BoxerAttributes): FightDuration
}
