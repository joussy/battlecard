import { Injectable } from '@nestjs/common';
import {
  ImportBoxersResponseDto,
  BoxerImportErrorDto,
  ImportBoxerDto,
} from '../dtos/import.dto';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { BoxerService } from './boxer.service';
import { ApiBoxerCreate } from '@/shared/types/api';
import { TournamentService } from './tournament.service';
import { Repository } from 'typeorm';
import { Boxer } from '@/entities/boxer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender } from '@/shared/types/modality.type';

@Injectable()
export class ImportService {
  constructor(
    private readonly boxerService: BoxerService,
    private readonly tournamentService: TournamentService,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
  ) {}

  async verifyBoxers(
    boxers: ImportBoxerDto[],
    user: AuthenticatedUser,
  ): Promise<BoxerImportErrorDto[]> {
    const errors: BoxerImportErrorDto[] = [];
    // Check for duplicate licenses in the import payload
    const licenseCount: Record<string, number> = {};
    boxers.forEach((boxer) => {
      if (boxer.license) {
        licenseCount[boxer.license] = (licenseCount[boxer.license] || 0) + 1;
      }
    });
    // check if any field is empty
    boxers.forEach((boxer, i) => {
      if (!boxer.name) {
        errors.push({
          message: 'Name is required',
          row: i,
          field: 'name',
        });
      }
      if (!boxer.firstname) {
        errors.push({
          message: 'First name is required',
          row: i,
          field: 'firstname',
        });
      }
      if (!boxer.birth_date) {
        errors.push({
          message: 'Birth date is required',
          row: i,
          field: 'birth_date',
        });
      }
      if (!boxer.license) {
        errors.push({
          message: 'License is required',
          row: i,
          field: 'license',
        });
      }
      if (boxer.gender != Gender.FEMALE && boxer.gender != Gender.MALE) {
        errors.push({
          message: 'Gender is required',
          row: i,
          field: 'gender',
        });
      }

      if (
        boxer.weight === undefined ||
        boxer.weight === null ||
        typeof boxer.weight !== 'number' ||
        boxer.weight < 1
      ) {
        errors.push({
          message: 'Weight is required',
          row: i,
          field: 'weight',
        });
      }
      if (!boxer.club) {
        errors.push({
          message: 'Club is required',
          row: i,
          field: 'club',
        });
      }
    });

    boxers.forEach((boxer, i) => {
      if (boxer.license && licenseCount[boxer.license] > 1) {
        errors.push({
          message: 'Duplicate license in import',
          row: i,
          field: 'license',
        });
      }
    });

    const licenses = boxers.map((b) => b.license);
    if (licenses.length > 0) {
      const dbBoxers = await this.boxerRepository.find({
        where: {
          userId: user.id,
        },
      });

      dbBoxers.forEach((dbBoxer) => {
        // Find all rows in the import with this license
        boxers.forEach((boxer, i) => {
          if (boxer.license === dbBoxer.license) {
            errors.push({
              message: 'License already exists for this user',
              row: i,
              field: 'license',
            });
          }
        });
      });
    }

    return errors;
  }

  async importBoxers(
    boxers: ImportBoxerDto[],
    verify: boolean,
    user: AuthenticatedUser,
  ): Promise<ImportBoxersResponseDto> {
    const errors = await this.verifyBoxers(boxers, user);
    if (verify || errors.length > 0) {
      return {
        success: errors.length === 0,
        message: '',
        errors,
      };
    }
    let imported = 0;
    for (let i = 0; i < boxers.length; i++) {
      const boxer = boxers[i];
      try {
        // Map DTO fields to ApiBoxerCreate
        const boxerCreate: ApiBoxerCreate = {
          lastName: boxer.name,
          firstName: boxer.firstname,
          birthDate: boxer.birth_date,
          nbFights: undefined,
          club: boxer.club,
          weight: boxer.weight,
          gender: boxer.gender,
          license: boxer.license,
        };
        await this.boxerService.create(boxerCreate, user);
        imported++;
      } catch (e) {
        let message = 'Unknown error';
        if (
          e &&
          typeof e === 'object' &&
          'message' in e &&
          typeof (e as { message?: unknown }).message === 'string'
        ) {
          message = (e as { message: string }).message;
        }
        errors.push({
          message,
          row: i,
          field: '',
        });
      }
    }
    return {
      success: errors.length === 0,
      message:
        errors.length === 0
          ? `Successfully imported ${imported} boxers.`
          : `Imported ${imported} boxers with ${errors.length} errors`,
      errors: errors,
    };
  }
}
