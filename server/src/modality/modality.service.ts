import { Injectable } from '@nestjs/common';
import { Boxer } from 'src/entities/boxer.entity';
import { FightDuration, ModalityError } from '@/shared/types/modality.type';
import { BeaModality } from './BeaModality';

@Injectable()
export class ModalityService {
  private beaModality = new BeaModality();

  isEligible(boxer1: Boxer, boxer2: Boxer): boolean {
    return this.beaModality.isEligible(boxer1, boxer2);
  }

  getModalityProblems(boxer1: Boxer, boxer2: Boxer): ModalityError[] {
    return this.beaModality.getModalityProblems(boxer1, boxer2);
  }

  getCategoryName(boxer: Boxer, shortText: boolean): string {
    return this.beaModality.getCategoryName(boxer, shortText);
  }

  getFightDuration(boxer1: Boxer, boxer2: Boxer): FightDuration {
    return this.beaModality.getFightDuration(boxer1, boxer2);
  }
}
