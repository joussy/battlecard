import { Boxer } from "../types/boxing";
import { BaseModality } from "./BaseModality";
import { IModality } from "./IModality";

export class BeaModality extends BaseModality {
    getEligibilityProblems(boxer1: Boxer, boxer2: Boxer): string[] {
        const errors : string[] = [];
        if (boxer2.lastName.startsWith('S')){
            errors.push("J'aime pas la lettre M")
        }

        return errors;
    }
}