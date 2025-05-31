import { Injectable } from '@nestjs/common';
import { BeaModality } from './BeaModality';
import { IModality } from './IModality';

@Injectable()
export class ModalityService {
  private beaModality = new BeaModality();

  getModality(): IModality {
    return this.beaModality;
  }
}
