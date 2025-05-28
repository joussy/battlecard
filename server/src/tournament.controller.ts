import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { toTournament, toApiTournament } from './adapters/tournament.adapter';
import { ApiTournament } from '@/shared/types/api';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import { Boxer } from './entities/boxer.entity';
import { toApiBoxerGet } from './adapters/boxer.adapter';
import { ApiBoxerGet } from '@/shared/types/api';

@Controller('tournaments')
export class TournamentController {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentBoxer)
    private readonly tournamentBoxerRepository: Repository<TournamentBoxer>,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
  ) {}

  @Get()
  async findAll(): Promise<ApiTournament[]> {
    const dbTournaments = await this.tournamentRepository.find();
    return dbTournaments.map(toApiTournament);
  }

  @Post()
  async create(
    @Body() tournament: Partial<ApiTournament>,
  ): Promise<ApiTournament> {
    if ('id' in tournament) {
      delete tournament.id;
    }
    const dbTournament = await this.tournamentRepository.save(
      toTournament(tournament as ApiTournament),
    );
    return toApiTournament(dbTournament);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.tournamentRepository.delete(id);
  }

  @Get(':tournamentId/boxers')
  async getBoxersForTournament(
    @Param('tournamentId') tournamentId: string,
  ): Promise<ApiBoxerGet[]> {
    const tournamentBoxers = await this.tournamentBoxerRepository.find({
      where: { tournamentId },
    });
    const boxerIds = tournamentBoxers.map((tb) => tb.boxerId);
    if (boxerIds.length === 0) return [];
    const boxers = await this.boxerRepository.findByIds(boxerIds);
    return boxers.map(toApiBoxerGet);
  }

  @Get(':tournamentId/boxers/:boxerId/opponents')
  async getPossibleOpponents(
    @Query('boxerId') boxerId: string,
    @Query('tournamentId') tournamentId: string,
  ): Promise<ApiBoxerGet[]> {
    if (!boxerId || !tournamentId) {
      return [];
    }

    const tournamentBoxers = await this.tournamentBoxerRepository.find({
      where: { tournamentId },
    });

    const boxerIds = tournamentBoxers
      .filter((tb) => tb.boxerId !== boxerId)
      .map((tb) => tb.boxerId);

    if (boxerIds.length === 0) {
      return [];
    }

    const boxers = await this.boxerRepository.findByIds(boxerIds);
    return boxers.map((b): ApiBoxerGet => toApiBoxerGet(b));
  }
}
