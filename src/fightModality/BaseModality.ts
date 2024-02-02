import { Boxer } from "../types/boxing";
import { IModality } from "./IModality";

export abstract class BaseModality implements IModality {
    abstract getEligibilityProblems(boxer1: Boxer, boxer2: Boxer): string[];
    isEligible(boxer1: Boxer, boxer2: Boxer): boolean {

        return this.getEligibilityProblems(boxer1, boxer2)?.length < 1;
    }
}