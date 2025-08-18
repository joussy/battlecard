import { Injectable, Logger } from '@nestjs/common';
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
import { toApiImportBoxer } from '@/adapters/boxer.adapter';
import { ConfigService } from '@nestjs/config';
import { parse, format } from 'date-fns';
import { Buffer } from 'buffer';

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
  ): Promise<ApiPreviewBoxersResponse> {
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
    // Map the parsed CSV data to ImportBoxerDto using array indices
    const parsed: ApiImportBoxer[] = res.map((row) => toApiImportBoxer(row));
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

      const entry: ApiImportBoxer = {
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
    dry: boolean,
    tournamentId: string,
    user: AuthenticatedUser,
  ): Promise<ApiImportBoxersResponse> {
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
        const boxerCreate: ApiBoxerCreate = {
          lastName: boxer.lastName,
          firstName: boxer.firstName,
          birthDate: boxer.birthDate,
          nbFights: undefined,
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
  async previewBoxersFromApi(ids: string[]): Promise<ApiPreviewBoxersResponse> {
    let response: Response;
    const csvBoxers: ApiImportBoxer[] = [];
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
      csvBoxers.push(toApiImportBoxer(parsed as CsvBoxer));
    }
    return {
      boxers: csvBoxers,
      success: true,
      message: 'API import preview successful',
    };
  }

  /**
   * Send image buffer to configured OpenAI Responses API and request CSV conversion.
   * The model is asked to return a CSV with headers matching the project's CSV parser.
   */
  async previewBoxersFromImage(
    buffer: Buffer,
  ): Promise<ApiPreviewBoxersResponse> {
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    const openaiUrl =
      this.configService.get<string>('OPENAI_RESPONSES_URL') ||
      'https://api.openai.com/v1/responses';

    if (!openaiKey) {
      this.logger.error('OpenAI API key not configured');
      return {
        success: false,
        message: 'AI provider not configured',
        boxers: [],
      };
    }

    // Encode image to base64 and build a simple instruction
    const base64 = buffer.toString('base64');
    const instruction = `You are given an image (base64). Extract a CSV containing boxers with headers: lastName,firstName,birthDate,weight,gender,club,license,fightRecord. Return ONLY the CSV content (no markdown, no commentary). If you fail, return an empty CSV with headers only.`;

    // Build multipart/form-data body as JSON per OpenAI Responses API with inputs including the image
    const body = {
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: instruction },
            {
              type: 'input_image',
              image_base64: base64,
              filename: 'boxers.jpg',
            },
          ],
        },
      ],
      // ask model to be brief
      max_output_tokens: 1500,
    };

    const getMessage = (err: unknown) => {
      if (err === null || err === undefined) return '';
      if (typeof err === 'string') return err;
      if (err instanceof Error && typeof err.message === 'string')
        return err.message;
      return JSON.stringify(err);
    };
    try {
      const res = await fetch(openaiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const t = await res.text();
        this.logger.error('OpenAI Responses API error', res.status, t);
        return {
          success: false,
          message: 'AI provider error',
          boxers: [],
        };
      }
      const parsedRaw = await res.text();

      if (!parsedRaw || parsedRaw.trim().length === 0) {
        return {
          success: false,
          message: 'AI did not return CSV output',
          boxers: [],
        };
      }

      // Parse CSV into boxer objects using existing parser
      const preview = await this.previewBoxersFromCsv(parsedRaw);
      return preview;
    } catch (e: any) {
      this.logger.error('Failed to parse CSV from AI output', getMessage(e));
      return {
        success: false,
        message: 'Failed to parse CSV from AI output',
        boxers: [],
      };
    }
  }
}
