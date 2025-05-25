import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import { Boxer } from './entities/boxer.entity';
import {
  toTournamentBoxer,
  toApiTournamentBoxer,
} from './adapters/tournamentBoxer.adapter';
import { ApiTournament_Boxer } from '@/shared/types/api';
import { ApiBoxer } from '@/shared/types/api';
import { toApiBoxer } from './adapters/boxer.adapter';

@Controller('tournament-boxers')
export class TournamentBoxerController {
  constructor(
    @InjectRepository(TournamentBoxer)
    private readonly tournamentBoxerRepository: Repository<TournamentBoxer>,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
  ) {}

  @Get()
  async findAll(
    @Query('tournamentId') tournamentId?: string,
  ): Promise<ApiTournament_Boxer[]> {
    if (tournamentId) {
      const tournamentBoxers = await this.tournamentBoxerRepository.find({
        where: { tournamentId },
      });
      return tournamentBoxers.map(toApiTournamentBoxer);
    }
    const all = await this.tournamentBoxerRepository.find();
    return all.map(toApiTournamentBoxer);
  }

  @Post()
  async create(
    @Body() tournamentBoxer: Partial<ApiTournament_Boxer>,
  ): Promise<ApiTournament_Boxer> {
    if ('id' in tournamentBoxer) {
      delete tournamentBoxer.id;
    }
    const dbTournamentBoxer = await this.tournamentBoxerRepository.save(
      toTournamentBoxer(tournamentBoxer as ApiTournament_Boxer),
    );
    return toApiTournamentBoxer(dbTournamentBoxer);
  }

  @Delete()
  async deleteMany(
    @Body() body: { boxerIds: string[]; tournamentId: string },
  ): Promise<void> {
    const { boxerIds, tournamentId } = body;
    if (!Array.isArray(boxerIds) || !tournamentId) return;
    await this.tournamentBoxerRepository.delete({
      tournamentId,
      boxerId: In(boxerIds),
    });
  }

  @Get()
  async getPossibleOpponents(
    @Query('boxerId') boxerId?: string,
    @Query('tournamentId') tournamentId?: string,
  ): Promise<ApiBoxer[]> {
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
    return boxers.map((b): ApiBoxer => toApiBoxer(b));
  }
}
