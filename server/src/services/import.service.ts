import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { BoxerService } from './boxer.service';
import {
  ApiBoxerCreate,
  ApiBoxerImportError,
  ApiImportBoxer,
  ApiImportBoxersResponse,
  ApiPreviewBoxersResponse,
} from '@/shared/types/api';
import { TournamentService } from './tournament.service';
import { Repository } from 'typeorm';
import { Boxer } from '@/entities/boxer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender } from '@/shared/types/modality.type';
import { parseCsvAsync } from '@/utils/csv.utils';
import { CsvBoxer, csvDelimiter } from '@/interfaces/csv.interface';

@Injectable()
export class ImportService {
  constructor(
    private readonly boxerService: BoxerService,
    private readonly tournamentService: TournamentService,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
  ) {}

  async previewBoxersFromCsv(
    payload: string,
  ): Promise<ApiPreviewBoxersResponse> {
    // Parse the CSV payload using csv-parse
    const res = (await parseCsvAsync(payload, {
      columns: true,
      skip_empty_lines: true,
      delimiter: csvDelimiter,
    })) as CsvBoxer[];
    console.log('Parsed CSV:', res);
    if (!res || res.length === 0) {
      return {
        success: false,
        message: 'No data found in CSV',
        boxers: [],
      };
    }
    // Map the parsed CSV data to ImportBoxerDto using array indices
    const parsed: ApiImportBoxer[] = res.map((row) => {
      const entry: ApiImportBoxer = {
        lastName: row.lastName,
        firstName: row.firstName,
        gender:
          row.gender === Gender.MALE.toString() ? Gender.MALE : Gender.FEMALE,
        weight: parseFloat(row.weight) || 0,
        club: row.club || '',
        birthDate: row.birthDate || '',
        license: row.license || '',
        fightRecord: row.fightRecord,
      };
      return entry;
    });
    return {
      boxers: parsed,
      success: true,
      message: 'CSV preview successful',
    };
  }

  async previewBoxersFromFFboxe(
    payload: string,
  ): Promise<ApiPreviewBoxersResponse> {
    // Parse the CSV payload using csv-parse
    const res = (await parseCsvAsync(payload, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';',
    })) as {
      Civilité: string;
      Nom: string;
      Prénom: string;
      DDN: string;
      'Nom structure': string;
      'Code adhérent': string;
      Poids: string;
    }[];
    if (!res || res.length === 0) {
      return {
        success: false,
        message: 'No data found in CSV',
        boxers: [],
      };
    }
    // Map the parsed CSV data to ImportBoxerDto using array indices
    const parsed: ApiImportBoxer[] = res.map((row) => {
      let gender: Gender | undefined = undefined;
      if (row['Civilité'] === 'M') {
        gender = Gender.MALE;
      } else if (row['Civilité'] === 'Mme') {
        gender = Gender.FEMALE;
      }

      const entry: ApiImportBoxer = {
        lastName: row['Nom'] || '',
        firstName: row['Prénom'] || '',
        // fights: row[CSV_IDX_FIGHTS] ? parseInt(row[CSV_IDX_FIGHTS], 10) : undefined, // optional
        gender,
        weight: row['Poids'] ? parseFloat(row['Poids']) : 0,
        club: row['Nom structure'] || '',
        birthDate: row['DDN'] || '',
        license: row['Code adhérent'] || '',
        fightRecord: 0, // FFboxe does not provide fight record
      };
      return entry;
    });
    // Deduplicate boxers by license (ffboxe does contains duplicates)
    const uniqueLicenses = new Set<string>();
    const deduplicated = parsed.filter((boxer) => {
      if (boxer.license && uniqueLicenses.has(boxer.license)) {
        return false; // Skip duplicates
      }
      uniqueLicenses.add(boxer.license);
      return true; // Keep unique boxer
    });
    return {
      boxers: deduplicated,
      success: true,
      message: 'CSV preview successful',
    };
  }

  async verifyBoxers(
    boxers: ApiImportBoxer[],
    user: AuthenticatedUser,
  ): Promise<ApiBoxerImportError[]> {
    const errors: ApiBoxerImportError[] = [];
    // Check for duplicate licenses in the import payload
    const licenseCount: Record<string, number> = {};
    boxers.forEach((boxer) => {
      if (boxer.license) {
        licenseCount[boxer.license] = (licenseCount[boxer.license] || 0) + 1;
      }
    });
    // check if any field is empty
    boxers.forEach((boxer, i) => {
      if (!boxer.lastName) {
        errors.push({
          message: 'Name is required',
          row: i,
          field: 'lastName',
        });
      }
      if (!boxer.firstName) {
        errors.push({
          message: 'First name is required',
          row: i,
          field: 'firstName',
        });
      }
      if (!boxer.birthDate) {
        errors.push({
          message: 'Birth date is required',
          row: i,
          field: 'birthDate',
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
    boxers: ApiImportBoxer[],
    verify: boolean,
    user: AuthenticatedUser,
  ): Promise<ApiImportBoxersResponse> {
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
          lastName: boxer.lastName,
          firstName: boxer.firstName,
          birthDate: boxer.birthDate,
          nbFights: undefined,
          club: boxer.club,
          weight: boxer.weight,
          gender: boxer.gender as Gender,
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
