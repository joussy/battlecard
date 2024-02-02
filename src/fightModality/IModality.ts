import { Boxer } from "../types/boxing";

export interface IModality{
    isEligible(boxer1: Boxer, boxer2: Boxer): boolean;
    getEligibilityProblems(boxer1: Boxer, boxer2: Boxer): string[];
}