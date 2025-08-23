import { FightDuration, ModalityError } from '@/interfaces/modality.interface';
import { Boxer } from 'src/entities/boxer.entity';

export interface IModality {
  isEligible(boxer1: Boxer, boxer2: Boxer): boolean;
  getModalityErrors(boxer1: Boxer, boxer2: Boxer): ModalityError[];
  getCategoryName(boxer: Boxer, shortText: boolean): string;
  getFightDuration(boxer1: Boxer, boxer2: Boxer): FightDuration;
}
