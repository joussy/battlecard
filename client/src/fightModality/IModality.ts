import { Boxer } from "@/types/boxing"
import { FightDuration, ModalityError } from "@/shared/types/modality.type"

export interface IModality {
    isEligible(boxer1: Boxer, boxer2: Boxer): boolean
    getModalityProblems(boxer1: Boxer, boxer2: Boxer): ModalityError[]
    getCategoryName(boxer: Boxer, shortText: boolean): string
    getFightDuration(boxer1: Boxer, boxer2: Boxer): FightDuration
}
