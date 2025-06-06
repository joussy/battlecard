import { Controller, Get, Body, Post, Param, Delete } from '@nestjs/common';
import { ModalityService } from '../modality/modality.service';
import { User } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { TournamentService } from '../services/tournament.service';
import {
  ApiOpponentGet,
  ApiTournament,
  ApiTournamentCreate,
} from '@/shared/types/api';

@Controller('tournaments')
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly modalityService: ModalityService,
  ) {}

  @Get()
  async findAll(@User() user: AuthenticatedUser): Promise<ApiTournament[]> {
    return this.tournamentService.findAll(user);
  }

  @Post()
  async create(
    @Body() tournament: ApiTournamentCreate,
    @User() user: AuthenticatedUser,
  ): Promise<ApiTournament> {
    return this.tournamentService.create(tournament, user);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    return this.tournamentService.delete(id, user);
  }

  @Get(':tournamentId/boxers')
  async getBoxersForTournament(
    @Param('tournamentId') tournamentId: string,
  ): Promise<import('@/shared/types/api').ApiBoxerGet[]> {
    return this.tournamentService.getBoxersForTournament(tournamentId);
  }

  @Get(':tournamentId/opponents/:boxerId')
  async getPossibleOpponents(
    @Param('boxerId') boxerId: string,
    @Param('tournamentId') tournamentId: string,
    @User() user: AuthenticatedUser,
  ): Promise<ApiOpponentGet[]> {
    return this.tournamentService.getPossibleOpponents(
      boxerId,
      tournamentId,
      user,
    );
  }
}
