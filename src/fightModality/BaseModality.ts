import { BoxerAttributes } from "../types/boxing";
import { IModality } from "./IModality";
import { ModalityError } from "../types/modality";

export abstract class BaseModality implements IModality {
    abstract getCategory(boxer: BoxerAttributes): string;
    abstract getModalityProblems(boxer1: BoxerAttributes, boxer2: BoxerAttributes): ModalityError[];
    isEligible(boxer1: BoxerAttributes, boxer2: BoxerAttributes): boolean {

        return this.getModalityProblems(boxer1, boxer2)?.length < 1;
    }
}