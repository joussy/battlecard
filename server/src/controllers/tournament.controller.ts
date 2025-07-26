import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ModalityService } from '../modality/modality.service';
import { User } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { TournamentService } from '../services/tournament.service';
import {
  ApiBoxerGet,
  ApiFightGet,
  ApiOpponentGet,
  ApiTournament,
  ApiTournamentCreate,
} from '@/shared/types/api';
import { FightService } from '@/services/fight.service';

@Controller('tournaments')
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly fightService: FightService,
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

  @Put(':id')
  async update(
    @Param('id') tournamentId: string,
    @Body() tournament: ApiTournamentCreate,
    @User() user: AuthenticatedUser,
  ): Promise<ApiTournament> {
    await this.tournamentService.validateTournamentAccess(
      tournamentId,
      user.id,
    );
    return this.tournamentService.update(tournamentId, tournament, user);
  }

  @Delete(':id')
  async delete(
    @Param('id') tournamentId: string,
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    await this.tournamentService.validateTournamentAccess(
      tournamentId,
      user.id,
    );

    return this.tournamentService.delete(tournamentId, user);
  }

  @Get(':tournamentId/boxers')
  async getBoxersForTournament(
    @Param('tournamentId') tournamentId: string,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet[]> {
    await this.tournamentService.validateTournamentAccess(
      tournamentId,
      user.id,
    );

    return this.tournamentService.getBoxersForTournament(tournamentId, user);
  }

  @Get(':tournamentId/opponents/:boxerId')
  async getPossibleOpponents(
    @Param('boxerId') boxerId: string,
    @Param('tournamentId') tournamentId: string,
    @User() user: AuthenticatedUser,
  ): Promise<ApiOpponentGet[]> {
    await this.tournamentService.validateTournamentAccess(
      tournamentId,
      user.id,
    );
    return this.tournamentService.getPossibleOpponents(
      boxerId,
      tournamentId,
      user,
    );
  }

  @Get(':tournamentId/fights')
  async getFightsByTournamentId(
    @Param('tournamentId') tournamentId: string,
    @User() user: AuthenticatedUser,
  ): Promise<ApiFightGet[]> {
    await this.tournamentService.validateTournamentAccess(
      tournamentId,
      user.id,
    );
    return await this.fightService.findByTournamentId(tournamentId, user);
  }
}
