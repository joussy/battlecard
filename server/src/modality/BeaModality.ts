import { BaseModality } from './BaseModality';
import { differenceInDays } from 'date-fns';
import { Boxer } from '@/entities/boxer.entity';
import {
  FightDuration,
  ModalityError,
  BeaCategory,
  ModalityErrorType,
} from '@/shared/types/modality.type';

export class BeaModality extends BaseModality {
  categories: BeaCategory[] = [
    { name: 'Poussin 1', shortName: 'P1', roundDurationAsSeconds: 60 },
    { name: 'Poussin 2', shortName: 'P2', roundDurationAsSeconds: 60 },
    { name: 'Poussin 3', shortName: 'P3', roundDurationAsSeconds: 60 },
    { name: 'Poussin 4', shortName: 'P4', roundDurationAsSeconds: 60 },
    { name: 'Benjamin 1', shortName: 'B1', roundDurationAsSeconds: 60 },
    { name: 'Benjamin 2', shortName: 'B2', roundDurationAsSeconds: 60 },
    { name: 'Minime 1', shortName: 'M1', roundDurationAsSeconds: 90 },
    { name: 'Minime 2', shortName: 'M2', roundDurationAsSeconds: 90 },
    { name: 'Cadet 1', shortName: 'C1', roundDurationAsSeconds: 120 },
    { name: 'Cadet 2', shortName: 'C2', roundDurationAsSeconds: 120 },
    { name: 'Junior 1', shortName: 'J1', roundDurationAsSeconds: 120 },
    { name: 'Junior 2', shortName: 'J2', roundDurationAsSeconds: 120 },
    { name: 'Senior', shortName: 'Senior', roundDurationAsSeconds: 120 },
  ];

  getFightDuration(boxer1: Boxer, boxer2: Boxer): FightDuration {
    const boxer1Category = this.getCategory(boxer1);
    const boxer2Category = this.getCategory(boxer2);
    const roundDuration = Math.min(
      boxer1Category.roundDurationAsSeconds,
      boxer2Category.roundDurationAsSeconds,
    );
    return {
      restTimeAsSeconds: 60,
      roundDurationAsSeconds: roundDuration,
      rounds: 3,
    };
  }

  getModalityErrors(boxer1: Boxer, boxer2: Boxer): ModalityError[] {
    const errors: ModalityError[] = [];
    if (
      Math.abs(differenceInDays(boxer1.birthDate, boxer2.birthDate)) >
      365 * 2
    ) {
      errors.push({ type: ModalityErrorType.AGE });
    }
    if (
      boxer1.weight !== undefined &&
      boxer2.weight !== undefined &&
      Math.abs(boxer1.weight - boxer2.weight) > 3
    ) {
      errors.push({ type: ModalityErrorType.WEIGHT });
    }
    if (boxer1.club == boxer2.club) {
      errors.push({ type: ModalityErrorType.SAME_CLUB });
    }
    if (boxer1.id == boxer2.id) {
      errors.push({ type: ModalityErrorType.SAME_ID });
    }
    if (boxer1.gender != boxer2.gender) {
      errors.push({ type: ModalityErrorType.OPPOSITE_GENDER });
    }
    if (Math.abs(boxer1.nbFights - boxer2.nbFights) > 3) {
      errors.push({ type: ModalityErrorType.PRIZE_LIST });
    }
    return errors;
  }

  private getCategory(boxer: Boxer): BeaCategory {
    const birthYear = new Date(boxer.birthDate).getFullYear();
    let thisYear = new Date().getFullYear();
    if (new Date().getMonth() > 8) {
      thisYear += 1;
    }
    const delta = thisYear - birthYear - 7;
    if (delta >= 0 && delta < this.categories.length) {
      return this.categories[delta];
    }
    return this.categories[this.categories.length - 1];
  }

  getCategoryName(boxer: Boxer, shortText: boolean): string {
    const category = this.getCategory(boxer);
    const categoryName = shortText ? category.shortName : category.name;
    return categoryName;
  }
}
