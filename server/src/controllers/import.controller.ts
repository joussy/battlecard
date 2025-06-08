import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ModalityService } from '../modality/modality.service';
import { User } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { TournamentService } from '@/services/tournament.service';
import { ImportService } from '@/services/import.service';
import {
  ApiImportBoxers,
  ApiImportBoxersResponse,
  ApiPreviewBoxersCsv,
  ApiPreviewBoxersResponse,
} from '@/shared/types/api';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('import')
export class ImportController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly modalityService: ModalityService,
    private readonly importService: ImportService,
  ) {}

  @Post()
  async importBoxers(
    @Body() dto: ApiImportBoxers,
    @User() user: AuthenticatedUser,
  ): Promise<ApiImportBoxersResponse> {
    return this.importService.importBoxers(dto.boxers, dto.verify, user);
  }

  @Post('previewfromcsvText')
  async previewBoxersFromCsvText(
    @Body() dto: ApiPreviewBoxersCsv,
  ): Promise<ApiPreviewBoxersResponse> {
    return await this.importService.previewBoxersFromCsv(dto.payload);
  }

  @Post('previewFromCsvFile')
  @UseInterceptors(FileInterceptor('file'))
  async previewBoxersFromCsvFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({
            fileType: 'text/csv',
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ApiPreviewBoxersResponse> {
    //convert file buffer to string
    if (!file) {
      throw new Error('File buffer is missing');
    }
    const payload: string = file.buffer?.toString('utf-8');
    console.log('File buffer converted to string:', payload);
    return await this.importService.previewBoxersFromCsv(payload);
  }

  @Post('previewfromffboxeFile')
  @UseInterceptors(FileInterceptor('file'))
  async previewBoxersFromFfboxeFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({
            fileType: 'text/csv',
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ApiPreviewBoxersResponse> {
    //convert file buffer to string
    if (!file) {
      throw new Error('File buffer is missing');
    }
    const payload: string = file.buffer?.toString('utf-8');
    console.log('File buffer converted to string:', payload);
    return await this.importService.previewBoxersFromFFboxe(payload);
  }
}
