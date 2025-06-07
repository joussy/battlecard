import { Injectable } from '@nestjs/common';
import {
  ImportBoxersDto,
  ImportBoxersResponseDto,
  BoxerImportErrorDto,
} from '../dtos/import.dto';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { BoxerService } from './boxer.service';
import { ApiBoxerCreate } from '@/shared/types/api';
import { TournamentService } from './tournament.service';
import { Repository } from 'typeorm';
import { Boxer } from '@/entities/boxer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImportService {
  constructor(
    private readonly boxerService: BoxerService,
    private readonly tournamentService: TournamentService,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
  ) {}

  async verifyBoxers(
    dto: ImportBoxersDto,
    user: AuthenticatedUser,
  ): Promise<BoxerImportErrorDto[]> {
    const errors: BoxerImportErrorDto[] = [];
    // Check for duplicate licenses in the import payload
    const licenseCount: Record<string, number> = {};
    dto.boxers.forEach((boxer) => {
      if (boxer.license) {
        licenseCount[boxer.license] = (licenseCount[boxer.license] || 0) + 1;
      }
    });
    dto.boxers.forEach((boxer, i) => {
      if (boxer.license && licenseCount[boxer.license] > 1) {
        errors.push({
          message: 'Duplicate license in import',
          row: i,
          field: 'license',
        });
      }
    });

    const licenses = dto.boxers.map((b) => b.license);
    if (licenses.length > 0) {
      const dbBoxers = await this.boxerRepository.find({
        where: {
          userId: user.id,
        },
      });

      dbBoxers.forEach((dbBoxer) => {
        // Find all rows in the import with this license
        dto.boxers.forEach((boxer, i) => {
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
    dto: ImportBoxersDto,
    user: AuthenticatedUser,
  ): Promise<ImportBoxersResponseDto> {
    const errors = await this.verifyBoxers(dto, user);
    if (errors.length > 0) {
      return {
        success: false,
        message: `Import aborted: ${errors.length} duplicate license error(s) found.`,
        errors,
      };
    }
    let imported = 0;
    for (let i = 0; i < dto.boxers.length; i++) {
      const boxer = dto.boxers[i];
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
