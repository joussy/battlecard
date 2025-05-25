import { IModality } from "./IModality"
import { FightDuration, ModalityError } from "@/shared/types/modality.type"
import { Boxer } from "@/types/boxing"

export abstract class BaseModality implements IModality {
    abstract getCategoryName(boxer: Boxer, shortText: boolean): string
    abstract getFightDuration(boxer1: Boxer, boxer2: Boxer): FightDuration
    abstract getModalityProblems(boxer1: Boxer, boxer2: Boxer): ModalityError[]
    isEligible(boxer1: Boxer, boxer2: Boxer): boolean {
        return this.getModalityProblems(boxer1, boxer2)?.length < 1
    }
}
