import { BoxerAttributes } from "../types/boxing";
import { ModalityError, ModalityErrorType } from "../types/modality.d";
import { BaseModality } from "./BaseModality";
import {differenceInDays} from "date-fns";

export class BeaModality extends BaseModality {
    categories = [
        "Poussin 1", 
        "Poussin 2",
        "Poussin 3",
        "Poussin 4",
        "Benjamin 1", 
        "Benjamin 2", 
        "Minime 1", 
        "Minime 2", 
        "Cadet 1", 
        "Cadet 2", 
        "Junior 1", 
        "Junior 2"];

        categoriesShortText = [
            "P1", 
            "P2",
            "P3",
            "P4",
            "B1", 
            "B2", 
            "M1", 
            "M2", 
            "C1", 
            "C2", 
            "J1", 
            "J2"];
    
    getModalityProblems(boxer1: BoxerAttributes, boxer2: BoxerAttributes): ModalityError[] {
        const errors : ModalityError[] = [];
        if (Math.abs(differenceInDays(boxer1.birthDate, boxer2.birthDate)) > (365 * 2)){
            //formatDistance
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

    getCategory(boxer: BoxerAttributes, shortText: boolean): string {
        let category = "";
        const birthYear = boxer.birthDate.getFullYear();
        let thisYear = new Date().getFullYear();
        if (new Date().getMonth() > 8) {
            thisYear += 1;
        }
        const delta = thisYear - birthYear - 7;

        if (delta >= 0 && delta < this.categories.length){
            category = shortText ? this.categoriesShortText[delta] : this.categories[delta];
        } else {
            category = "Adulte Loisir"
        }

        return category;
    }
}