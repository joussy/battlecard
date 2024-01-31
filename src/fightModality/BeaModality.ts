import { Boxer } from "../types/boxing";
import { IModality } from "./IModality";

export class BeaModality implements IModality {
    canCompete(boxer1: Boxer, boxer2: Boxer): string[] {
        const errors : string[] = [];
        if (boxer2.lastName.startsWith('M')){
            errors.push("J'aime pas la lettre M")
        }

        return errors;
    }
}