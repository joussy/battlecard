import { Injectable, Logger } from '@nestjs/common';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { BoxerService } from './boxer.service';
import {
  BoxerImportErrorDto,
  ImportBoxersResponseDto,
  PreviewBoxersResponseDto,
  ImportBoxerResponseDto,
} from '@/dto/response.dto';
import { TournamentService } from './tournament.service';
import { Repository } from 'typeorm';
import { Boxer } from '@/entities/boxer.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { parseCsvAsync } from '@/utils/csv.utils';
import { CsvBoxer, csvDelimiter } from '@/interfaces/csv.interface';
import { toImportBoxerDto } from '@/adapters/boxer.adapter';
import { ConfigService } from '@nestjs/config';
import { parse, format } from 'date-fns';
import { CreateBoxerDto } from '@/dto/boxer.dto';
import { Gender } from '@/interfaces/modality.interface';

@Injectable()
export class ImportService {
  constructor(
    private readonly boxerService: BoxerService,
    private readonly tournamentService: TournamentService,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(ImportService.name);

  async previewBoxersFromCsv(
    payload: string,
  ): Promise<PreviewBoxersResponseDto> {
    // Parse the CSV payload using csv-parse
    const res = (await parseCsvAsync(payload, {
      columns: true,
      skip_empty_lines: true,
      delimiter: csvDelimiter,
    })) as CsvBoxer[];

    if (!res || res.length === 0) {
      return {
        success: false,
        message: 'No data found in CSV',
        boxers: [],
      };
    }
    // Map the parsed CSV data to ImportBoxerResponseDto using array indices
    const parsed: ImportBoxerResponseDto[] = res.map((row) =>
      toImportBoxerDto(row),
    );
    return {
      boxers: parsed,
      success: true,
      message: 'CSV preview successful',
    };
  }

  async previewBoxersFromFFboxe(
    payload: string,
  ): Promise<PreviewBoxersResponseDto> {
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
    // Map the parsed CSV data to ImportBoxerResponseDto using array indices
    const parsed: ImportBoxerResponseDto[] = res.map((row) => {
      let gender: Gender | undefined = undefined;
      if (row['Civilité'] === 'M') {
        gender = Gender.MALE;
      } else if (row['Civilité'] === 'Mme') {
        gender = Gender.FEMALE;
      }

      // Convert date from dd/MM/yyyy to yyyy-MM-dd using date-fns
      let birthDate = row['DDN'] || '';
      if (birthDate) {
        try {
          const parsedDate = parse(birthDate, 'dd/MM/yyyy', new Date());
          birthDate = format(parsedDate, 'yyyy-MM-dd');
        } catch {
          birthDate = ''; // If parsing fails, set date to empty string
        }
      }

      const entry: ImportBoxerResponseDto = {
        lastName: row['Nom'] || '',
        firstName: row['Prénom'] || '',
        // fights: row[CSV_IDX_FIGHTS] ? parseInt(row[CSV_IDX_FIGHTS], 10) : undefined, // optional
        gender,
        weight: row['Poids'] ? parseFloat(row['Poids']) : 0,
        club: row['Nom structure'] || '',
        birthDate: birthDate,
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
    boxers: ImportBoxerResponseDto[],
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
    boxers: ImportBoxerResponseDto[],
    dry: boolean,
    tournamentId: string,
    user: AuthenticatedUser,
  ): Promise<ImportBoxersResponseDto> {
    const errors = await this.verifyBoxers(boxers, user);
    if (dry || errors.length > 0) {
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
        const boxerCreate: CreateBoxerDto = {
          lastName: boxer.lastName,
          firstName: boxer.firstName,
          birthDate: boxer.birthDate,
          nbFights: 0,
          club: boxer.club,
          weight: boxer.weight,
          gender: boxer.gender as Gender,
          license: boxer.license,
          tournamentId: tournamentId,
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
  async previewBoxersFromApi(ids: string[]): Promise<PreviewBoxersResponseDto> {
    let response: Response;
    const csvBoxers: ImportBoxerResponseDto[] = [];
    for (const id of ids) {
      try {
        this.logger.debug('Calling Import API to import boxer by ID:', id);
        const url =
          `${this.configService.get<string>('IMPORT_API_URL')}`.replace(
            '{id}',
            encodeURIComponent(id),
          );
        const apiKey = this.configService.get<string>(
          'IMPORT_API_HEADER_X_API_KEY',
        );
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey ?? '',
          },
        });
      } catch (err: any) {
        this.logger.error('Error calling Calling Import API:', err);
        continue;
      }
      if (!response) {
        console.error('Import API response error:', response);
        continue;
      }
      const responseText = await response.text();
      if (!responseText || responseText.length === 0) {
        console.error('No data found in Import API response for ID:', id);
        continue;
      }
      this.logger.debug('Import API response received for ID:', id);
      let parsed: unknown;
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        console.error(
          'Failed to parse JSON from Import API response for ID:',
          id,
          e,
        );
        continue;
      }
      if (!parsed || typeof parsed !== 'object') {
        console.error('No boxers found in Import API response for ID:', id);
        continue;
      }
      // Optionally, add more property checks here to validate CsvBoxer shape
      this.logger.debug('Parsed boxers from Import API response:', parsed);
      csvBoxers.push(toImportBoxerDto(parsed as CsvBoxer));
    }
    return {
      boxers: csvBoxers,
      success: true,
      message: 'API import preview successful',
    };
  }
}
