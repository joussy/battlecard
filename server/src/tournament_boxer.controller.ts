import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import { Boxer } from './entities/boxer.entity';

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
  ): Promise<Boxer[]> {
    if (tournamentId) {
      const tournamentBoxers = await this.tournamentBoxerRepository.find({
        where: { tournamentId },
      });
      const boxerIds = tournamentBoxers.map((tb) => tb.boxerId);
      if (boxerIds.length === 0) return [];
      return this.boxerRepository.findByIds(boxerIds);
    }
    return this.boxerRepository.find();
  }

  @Post()
  async create(
    @Body() tournamentBoxer: Partial<TournamentBoxer>,
  ): Promise<TournamentBoxer> {
    if ('id' in tournamentBoxer) {
      delete tournamentBoxer.id;
    }
    return this.tournamentBoxerRepository.save(tournamentBoxer);
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
}
