import { Boxer } from "../types/boxing";

export interface IModality{
    canCompete(boxer1: Boxer, boxer2: Boxer): string[];
}