import { Boxer, BoxerAttributes } from "../types/boxing";
import { ModalityError, ModalityErrorType } from "../types/modality.d";
import { BaseModality } from "./BaseModality";
import { IModality } from "./IModality";

export class BeaModality extends BaseModality {
    getModalityProblems(boxer1: BoxerAttributes, boxer2: BoxerAttributes): ModalityError[] {
        const errors : ModalityError[] = [];
        if (boxer2.lastName.startsWith('S')){
            errors.push({type: ModalityErrorType.AGE})
        }
        if (Math.abs(boxer1.weight - boxer2.weight) > 2){
            errors.push({type: ModalityErrorType.WEIGHT})
        }
        if (boxer1.club == boxer2.club){
            errors.push({type: ModalityErrorType.SAME_CLUB})
        }
        if (boxer1.id == boxer2.id){
            errors.push({type: ModalityErrorType.SAME_ID})
        }
        if (boxer1.gender != boxer2.gender) {
            errors.push({type: ModalityErrorType.OPPOSITE_GENDER})
        }
        if (Math.abs(boxer1.nbFights - boxer2.nbFights) > 3) {
            errors.push({type: ModalityErrorType.PRIZE_LIST})
        }

        return errors;
    }
}