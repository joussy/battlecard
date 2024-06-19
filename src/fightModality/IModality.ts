import { BoxerAttributes } from "../types/boxing"
import { ModalityError } from "../types/modality"

export interface IModality {
    isEligible(boxer1: BoxerAttributes, boxer2: BoxerAttributes): boolean
    getModalityProblems(boxer1: BoxerAttributes, boxer2: BoxerAttributes): ModalityError[]
    getCategory(boxer: BoxerAttributes, shortText: boolean): string
}
