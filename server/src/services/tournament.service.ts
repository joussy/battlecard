import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { TournamentBoxer } from '../entities/tournament_boxer.entity';
import { Boxer } from '../entities/boxer.entity';
import { Fight } from '../entities/fight.entity';
import { toTournament, toApiTournament } from '../adapters/tournament.adapter';
import { toApiBoxerGet, toApiOpponentGet } from '../adapters/boxer.adapter';
import {
  ApiTournament,
  ApiTournamentCreate,
  ApiBoxerGet,
  ApiOpponentGet,
} from '@/shared/types/api';
import { ModalityService } from '../modality/modality.service';
import { AuthenticatedUser } from '@/interfaces/auth.interface';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentBoxer)
    private readonly tournamentBoxerRepository: Repository<TournamentBoxer>,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    private readonly modalityService: ModalityService,
  ) {}

  async findAll(user: AuthenticatedUser): Promise<ApiTournament[]> {
    const dbTournaments = await this.tournamentRepository.find({
      where: { userId: user.id },
      order: { date: 'DESC', name: 'ASC' },
    });
    return dbTournaments.map(toApiTournament);
  }

  async create(
    tournament: ApiTournamentCreate,
    user: AuthenticatedUser,
  ): Promise<ApiTournament> {
    const dbTournament = await this.tournamentRepository.save(
      toTournament(tournament, user.id),
    );
    return toApiTournament(dbTournament);
  }

  async update(
    tournamentId: string,
    tournament: ApiTournamentCreate,
    user: AuthenticatedUser,
  ): Promise<ApiTournament> {
    const dbTournament = toTournament(tournament, user.id);
    dbTournament.id = tournamentId;
    const updatedTournament =
      await this.tournamentRepository.save(dbTournament);
    return toApiTournament(updatedTournament);
  }

  async delete(id: string, user: AuthenticatedUser): Promise<void> {
    await this.tournamentRepository.findOneOrFail({
      where: { id, userId: user.id },
    });
    await this.tournamentRepository.delete(id);
  }

  async getBoxersForTournament(
    tournamentId: string,
    user: AuthenticatedUser,
  ): Promise<ApiBoxerGet[]> {
    await this.tournamentRepository.findOneOrFail({
      where: { id: tournamentId, userId: user.id },
    });
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

  async getPossibleOpponents(
    boxerId: string,
    tournamentId: string,
    user: AuthenticatedUser,
  ): Promise<ApiOpponentGet[]> {
    if (!boxerId || !tournamentId) {
      return [];
    }
    await this.tournamentRepository.findOneOrFail({
      where: { id: tournamentId, userId: user.id },
    });
    const mainBoxer = await this.boxerRepository.findOne({
      where: { id: boxerId, userId: user.id },
    });
    if (!mainBoxer) {
      return [];
    }
    const tournamentBoxers = await this.tournamentBoxerRepository.find({
      where: { tournamentId },
    });
    const boxerIds = tournamentBoxers
      .map((tb) => tb.boxerId)
      .filter((id) => id !== boxerId);
    let boxers = await this.boxerRepository.findByIds(boxerIds);
    boxers = boxers.filter((b) => b.gender === mainBoxer.gender);
    if (boxers.length === 0) {
      return [];
    }
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

  async validateTournamentAccess(
    tournamentId: string,
    userId: string,
  ): Promise<void> {
    if (!tournamentId || !userId) {
      //don't remove this check, it is important to prevent unauthorized access with typeorm
      throw new Error('Invalid tournament or user ID');
    }
    await this.tournamentRepository.findOneOrFail({
      where: { id: tournamentId, userId },
    });
  }
}
