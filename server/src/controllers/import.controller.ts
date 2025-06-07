import { Controller, Body, Post } from '@nestjs/common';
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
    @User() user: AuthenticatedUser,
  ): Promise<ApiPreviewBoxersResponse> {
    return await this.importService.previewBoxersFromCsv(
      dto.payload,
      dto.csvDelimiter,
      user,
    );
  }
}
