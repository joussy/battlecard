import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Logger,
} from '@nestjs/common';
import { ModalityService } from '../modality/modality.service';
import { User } from '@/decorators/auth.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { TournamentService } from '@/services/tournament.service';
import { ImportService } from '@/services/import.service';
import {
  ImportBoxersResponseDto,
  PreviewBoxersResponseDto,
} from '@/dto/import.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ImportBoxersDto,
  PreviewBoxersApiDto,
  PreviewBoxersCsvDto,
} from '@/dto/import.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from '@/dto/upload.dto';

@Controller('import')
export class ImportController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly modalityService: ModalityService,
    private readonly importService: ImportService,
  ) {}
  private readonly logger = new Logger(ImportController.name);

  @Post()
  async importBoxers(
    @Body() dto: ImportBoxersDto,
    @User() user: AuthenticatedUser,
  ): Promise<ImportBoxersResponseDto> {
    return this.importService.importBoxers(
      dto.boxers,
      dto.dry,
      dto.tournamentId,
      user,
    );
  }

  @Post('previewfromcsvText')
  async previewBoxersFromCsvText(
    @Body() dto: PreviewBoxersCsvDto,
  ): Promise<PreviewBoxersResponseDto> {
    return await this.importService.previewBoxersFromCsv(dto.payload);
  }

  @Post('previewFromCsvFile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
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
  ): Promise<PreviewBoxersResponseDto> {
    //convert file buffer to string
    if (!file) {
      throw new Error('File buffer is missing');
    }
    const payload: string = file.buffer?.toString('utf-8');
    this.logger.debug('File buffer converted to string:', payload);
    return await this.importService.previewBoxersFromCsv(payload);
  }

  @Post('previewfromffboxeFile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
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
  ): Promise<PreviewBoxersResponseDto> {
    //convert file buffer to string
    if (!file) {
      throw new Error('File buffer is missing');
    }
    const payload: string = file.buffer?.toString('utf-8');
    this.logger.debug('File buffer converted to string:', payload);
    return await this.importService.previewBoxersFromFFboxe(payload);
  }

  @Post('previewFromApi')
  async previewFromApi(
    @Body() dto: PreviewBoxersApiDto,
    @User() user: AuthenticatedUser,
  ): Promise<PreviewBoxersResponseDto> {
    if (!user.apiEnabled) {
      this.logger.error('API access is not enabled for user:', user.id);
      return {
        success: false,
        message: 'API access is not enabled for this user.',
        boxers: [],
      };
    }
    const ids = dto.payload.split('\n').filter((id) => id.trim() !== '');
    return await this.importService.previewBoxersFromApi(ids);
  }
}
