import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Fight } from '../entities/fight.entity';
import { Boxer } from '../entities/boxer.entity';
import { ApiFightGet, ApiFightCreate } from '@/shared/types/api';
import { toApiFight, toFightFromCreate } from '../adapters/fight.adapter';
import { ModalityService } from '../modality/modality.service';
import { AuthenticatedUser } from '@/interfaces/auth.interface';

@Injectable()
export class FightService {
  constructor(
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
    private readonly modalityService: ModalityService,
  ) {}

  async findByTournamentId(
    tournamentId: string,
    user: AuthenticatedUser,
  ): Promise<ApiFightGet[]> {
    const dbFights = await this.fightRepository.find({
      where: { tournament: { userId: user.id }, tournamentId },
      order: { order: 'ASC' },
      relations: ['boxer1', 'boxer2', 'tournament'],
    });
    const modality = this.modalityService.getModality();
    return dbFights.map((fight) => toApiFight(fight, modality));
  }
  async findById(id: string, user: AuthenticatedUser): Promise<ApiFightGet> {
    const fight = await this.fightRepository.findOneOrFail({
      where: { id, tournament: { userId: user.id } },
      relations: ['boxer1', 'boxer2'],
    });
    const modality = this.modalityService.getModality();
    return toApiFight(fight, modality);
  }

  async create(fight: ApiFightCreate, user: AuthenticatedUser): Promise<Fight> {
    await this.boxerRepository.findOneOrFail({
      where: [{ id: fight.boxer1Id, userId: user.id }],
    });
    await this.boxerRepository.findOneOrFail({
      where: [{ id: fight.boxer2Id, userId: user.id }],
    });
    const existingFight = await this.fightRepository.findOne({
      where: [
        {
          tournamentId: fight.tournamentId,
          boxer1Id: fight.boxer1Id,
          boxer2Id: fight.boxer2Id,
        },
        {
          tournamentId: fight.tournamentId,
          boxer1Id: fight.boxer2Id,
          boxer2Id: fight.boxer1Id,
        },
      ],
    });
    if (existingFight) {
      throw new Error(
        'A fight between these two boxers already exists in this tournament.',
      );
    }
    return this.fightRepository.save(toFightFromCreate(fight));
  }

  async deleteMany(fightIds: string[], user: AuthenticatedUser): Promise<void> {
    if (!Array.isArray(fightIds) || fightIds.length === 0) return;
    const fights = await this.fightRepository.find({
      where: { id: In(fightIds), tournament: { userId: user.id } },
      relations: ['tournament'],
    });
    await this.fightRepository.delete(fights.map((f) => f.id));
  }

  async reorderFights(
    tournamentId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const allFights = await this.fightRepository.find({
      where: { tournamentId, tournament: { userId: user.id } },
      relations: ['tournament'],
    });
    const orderedFights = allFights.sort((a, b) => a.order - b.order);
    for (let i = 0; i < orderedFights.length; i++) {
      const fight = orderedFights[i];
      if (fight && fight.order !== i + 1) {
        await this.fightRepository.update(fight.id, { order: i + 1 });
      }
    }
  }
  async reorderFight(
    fightId: string,
    newOrder: number,
    user: AuthenticatedUser,
  ): Promise<void> {
    const fight = await this.fightRepository.findOneOrFail({
      where: { id: fightId, tournament: { userId: user.id } },
      relations: ['tournament'],
    });
    const allFights = await this.fightRepository.find({
      where: {
        tournamentId: fight.tournamentId,
        tournament: { userId: user.id },
      },
      relations: ['boxer1', 'boxer2'],
      order: { order: 'ASC' },
    });
    const orderedFights = allFights.sort((a, b) => a.order - b.order);
    const currentIdx = orderedFights.findIndex((f) => f.id === fightId);
    if (currentIdx === -1) throw new Error('Fight not found in tournament');
    if (newOrder < 0 || newOrder >= orderedFights.length) {
      throw new Error('Invalid index for reordering');
    }
    // Remove the fight from its current position
    const [movedFight] = orderedFights.splice(currentIdx, 1);
    // Insert the fight at the new order
    orderedFights.splice(newOrder, 0, movedFight);
    // Update the order of all fights
    for (let i = 0; i < orderedFights.length; i++) {
      const f = orderedFights[i];
      if (f.order !== i + 1) {
        await this.fightRepository.update(f.id, { order: i + 1 });
      }
    }
  }

  async switch(fightId: string, user: AuthenticatedUser): Promise<Fight> {
    const existingFight = await this.fightRepository.findOneOrFail({
      where: { id: fightId, tournament: { userId: user.id } },
      relations: ['tournament'],
    });
    // Swap boxer1 and boxer2
    const tempBoxerId = existingFight.boxer1Id;
    existingFight.boxer1Id = existingFight.boxer2Id;
    existingFight.boxer2Id = tempBoxerId;

    await this.fightRepository.update(fightId, existingFight);
    return this.fightRepository.findOneOrFail({
      where: { id: fightId },
      relations: ['boxer1', 'boxer2'],
    });
  }

  async findByBoxersAndTournament(
    boxer1Id: string,
    boxer2Id: string,
    tournamentId: string,
  ) {
    return this.fightRepository.findOne({
      where: [
        { boxer1Id, boxer2Id, tournamentId },
        { boxer1Id: boxer2Id, boxer2Id: boxer1Id, tournamentId },
      ],
      relations: ['boxer1', 'boxer2'],
    });
  }
}
