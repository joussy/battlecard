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
} from '@/shared/types/api';
import { FightService } from '@/services/fight.service';
import { CreateTournamentDto, UpdateTournamentDto } from '@/dto/tournament.dto';
import {
  TournamentBoxerParamsDto,
  IdParamsDto,
  TournamentIdParamsDto,
} from '@/dto/params.dto';

import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
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
    @Body() tournament: CreateTournamentDto,
    @User() user: AuthenticatedUser,
  ): Promise<ApiTournament> {
    return this.tournamentService.create(tournament, user);
  }

  @Put(':id')
  async update(
    @Param() params: IdParamsDto,
    @Body() tournament: UpdateTournamentDto,
    @User() user: AuthenticatedUser,
  ): Promise<ApiTournament> {
    await this.tournamentService.validateTournamentAccess(params.id, user.id);
    return this.tournamentService.update(params.id, tournament, user);
  }

  @Delete(':id')
  async delete(
    @Param() params: IdParamsDto,
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    await this.tournamentService.validateTournamentAccess(params.id, user.id);

    return this.tournamentService.delete(params.id, user);
  }

  @Get(':tournamentId/boxers')
  async getBoxersForTournament(
    @Param() params: TournamentIdParamsDto,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet[]> {
    await this.tournamentService.validateTournamentAccess(
      params.tournamentId,
      user.id,
    );

    return this.tournamentService.getBoxersForTournament(
      params.tournamentId,
      user,
    );
  }

  @Get(':tournamentId/opponents/:boxerId')
  async getPossibleOpponents(
    @Param() params: TournamentBoxerParamsDto,
    @User() user: AuthenticatedUser,
  ): Promise<ApiOpponentGet[]> {
    await this.tournamentService.validateTournamentAccess(
      params.tournamentId,
      user.id,
    );
    return this.tournamentService.getPossibleOpponents(
      params.boxerId,
      params.tournamentId,
      user,
    );
  }

  @Get(':tournamentId/fights')
  async getFightsByTournamentId(
    @Param() params: TournamentIdParamsDto,
    @User() user: AuthenticatedUser,
  ): Promise<ApiFightGet[]> {
    await this.tournamentService.validateTournamentAccess(
      params.tournamentId,
      user.id,
    );
    return await this.fightService.findByTournamentId(
      params.tournamentId,
      user,
    );
  }
}
