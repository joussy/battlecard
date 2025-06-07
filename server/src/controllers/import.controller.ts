import { Controller, Body, Post } from '@nestjs/common';
import { ModalityService } from '../modality/modality.service';
import { User } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { TournamentService } from '@/services/tournament.service';
import { ImportBoxersDto, ImportBoxersResponseDto } from '../dtos/import.dto';
import { ImportService } from '@/services/import.service';

@Controller('import')
export class ImportController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly modalityService: ModalityService,
    private readonly importService: ImportService,
  ) {}

  @Post()
  async importBoxers(
    @Body() dto: ImportBoxersDto,
    @User() user: AuthenticatedUser,
  ): Promise<ImportBoxersResponseDto> {
    return this.importService.importBoxers(dto, user);
  }
}
