import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { toTournament, toApiTournament } from './adapters/tournament.adapter';
import { ApiOpponentGet, ApiTournament } from '@/shared/types/api';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import { Boxer } from './entities/boxer.entity';
import { toApiBoxerGet, toApiOpponentGet } from './adapters/boxer.adapter';
import { ApiBoxerGet } from '@/shared/types/api';
import { Fight } from './entities/fight.entity';
import { ModalityService } from './modality/modality.service';

@Controller('tournaments')
export class TournamentController {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentBoxer)
    private readonly tournamentBoxerRepository: Repository<TournamentBoxer>,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    @Inject(ModalityService)
    private readonly modalityService: ModalityService,
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
    const fights = await this.fightRepository.find({
      where: [{ tournamentId }],
    });
    const boxerIds = tournamentBoxers.map((tb) => tb.boxerId);
    if (boxerIds.length === 0) return [];
    const boxers = await this.boxerRepository.findByIds(boxerIds);
    return boxers.map((b) => {
      const selectedFights = fights.filter(
        (f) => f.boxer1Id === b.id || f.boxer2Id === b.id,
      ).length;
      return toApiBoxerGet(
        b,
        this.modalityService.getModality(),
        selectedFights,
      );
    });
  }

  @Get(':tournamentId/opponents/:boxerId')
  async getPossibleOpponents(
    @Param('boxerId') boxerId: string,
    @Param('tournamentId') tournamentId: string,
  ): Promise<ApiOpponentGet[]> {
    if (!boxerId || !tournamentId) {
      return [];
    }

    // Get the gender of the main boxer
    const mainBoxer = await this.boxerRepository.findOne({
      where: { id: boxerId },
    });
    if (!mainBoxer) {
      return [];
    }

    const tournamentBoxers = await this.tournamentBoxerRepository.find({
      where: { tournamentId },
    });

    // Only keep boxers of the same gender
    const boxerIds = tournamentBoxers
      .map((tb) => tb.boxerId)
      .filter((id) => id !== boxerId);
    let boxers = await this.boxerRepository.findByIds(boxerIds);
    boxers = boxers.filter((b) => b.gender === mainBoxer.gender);

    if (boxers.length === 0) {
      return [];
    }

    // Find all fights in this tournament involving the main boxer and any opponent
    const fights = await this.fightRepository.find({
      where: [{ tournamentId }],
    });

    const opponents = boxers.map((o) => {
      const fightId = fights.find(
        (f) =>
          (f.boxer1Id === boxerId && f.boxer2Id === o.id) ||
          (f.boxer2Id === boxerId && f.boxer1Id === o.id),
      )?.id;
      const selectedFights = fights.filter(
        (f) => f.boxer1Id === o.id || f.boxer2Id === o.id,
      )?.length;
      const modality = this.modalityService.getModality();
      const modalityErrors = modality.getModalityErrors(mainBoxer, o);
      return toApiOpponentGet(
        o,
        modality,
        selectedFights,
        modalityErrors,
        fightId,
      );
    });

    return opponents;
  }
}
