import { Controller, Get, Body, Post, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { toTournament, toApiTournament } from './adapters/tournament.adapter';
import { ApiTournament } from '@/shared/types/api';

@Controller('tournaments')
export class TournamentController {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
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
}
