import { FightDuration, ModalityError } from '@/interfaces/modality.interface';
import { IModality } from './IModality';
import { Boxer } from 'src/entities/boxer.entity';

export abstract class BaseModality implements IModality {
  abstract getCategoryName(boxer: Boxer, shortText: boolean): string;
  abstract getFightDuration(boxer1: Boxer, boxer2: Boxer): FightDuration;
  abstract getModalityErrors(boxer1: Boxer, boxer2: Boxer): ModalityError[];
  isEligible(boxer1: Boxer, boxer2: Boxer): boolean {
    return this.getModalityErrors(boxer1, boxer2)?.length < 1;
  }
}
