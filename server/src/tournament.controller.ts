import { Controller, Get, Body, Post, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';

@Controller('tournaments')
export class TournamentController {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  @Get()
  async findAll(): Promise<Tournament[]> {
    return this.tournamentRepository.find();
  }

  @Post()
  async create(@Body() tournament: Partial<Tournament>): Promise<Tournament> {
    if ('id' in tournament) {
      delete tournament.id;
    }
    return this.tournamentRepository.save(tournament);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.tournamentRepository.delete(id);
  }
}
