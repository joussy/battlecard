import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boxer } from './entities/boxer.entity';
import { toBoxer, toApiBoxerGet } from './adapters/boxer.adapter';
import { ApiBoxerGet, ApiBoxerCreate } from '@/shared/types/api';
import { User } from './decorators/user.decorator';
import { AuthenticatedUser } from './interfaces/auth.interface';
import { TournamentBoxer } from './entities/tournament_boxer.entity';

@Controller('boxers')
export class BoxerController {
  constructor(
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
    @InjectRepository(TournamentBoxer)
    private readonly tournamentBoxerRepository: Repository<TournamentBoxer>,
  ) {}

  @Post()
  async create(
    @Body() boxer: ApiBoxerCreate,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet> {
    const dbBoxer = await this.boxerRepository.save(toBoxer(boxer, user.id));
    if (boxer.tournamentId) {
      const tournamentBoxer = new TournamentBoxer();
      tournamentBoxer.tournamentId = boxer.tournamentId;
      tournamentBoxer.boxerId = dbBoxer.id;
      await this.tournamentBoxerRepository.save(tournamentBoxer);
    }
    return toApiBoxerGet(dbBoxer);
  }

  @Get(':id')
  async getBoxer(@Param('id') id: string): Promise<ApiBoxerGet> {
    const dbBoxer = await this.boxerRepository.findOneByOrFail({ id });
    return toApiBoxerGet(dbBoxer);
  }

  @Put(':id')
  async update(
    @Param('id') boxerId: string,
    @Body() boxer: ApiBoxerCreate,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet> {
    await this.boxerRepository.update(boxerId, toBoxer(boxer, user.id));
    const updated = await this.boxerRepository.findOneBy({ id: boxerId });
    if (!updated) throw new NotFoundException('Boxer not found');
    return toApiBoxerGet(updated);
  }
}
