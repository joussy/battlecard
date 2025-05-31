import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Fight } from '../entities/fight.entity';
import { Boxer } from '../entities/boxer.entity';
import { ApiFightGet, ApiFightCreate } from '@/shared/types/api';
import { toFight, toApiFight } from '../adapters/fight.adapter';
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

  async findAll(user: AuthenticatedUser): Promise<ApiFightGet[]> {
    const dbFights = await this.fightRepository.find({
      where: { tournament: { userId: user.id } },
      order: { order: 'ASC' },
      relations: ['boxer1', 'boxer2', 'tournament'],
    });
    const modality = this.modalityService.getModality();
    return dbFights.map((fight) => {
      const fightDuration = modality.getFightDuration(
        fight.boxer1,
        fight.boxer2,
      );
      return toApiFight(fight, fightDuration);
    });
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
    return this.fightRepository.save(toFight(fight as ApiFightGet));
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
    fightIds: string[],
    tournamentId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    if (!Array.isArray(fightIds) || !tournamentId) return;
    const allFights = await this.fightRepository.find({
      where: { id: In(fightIds), tournament: { userId: user.id } },
      relations: ['tournament'],
    });
    const fightMap = new Map(allFights.map((f) => [f.id, f]));
    const orderedFights = [
      ...fightIds.map((id) => fightMap.get(id)).filter(Boolean),
      ...allFights.filter((f) => !fightIds.includes(f.id)),
    ];
    for (let i = 0; i < orderedFights.length; i++) {
      const fight = orderedFights[i];
      if (fight && fight.order !== i + 1) {
        await this.fightRepository.update(fight.id, { order: i + 1 });
      }
    }
  }

  async update(
    id: string,
    fight: ApiFightGet,
    user: AuthenticatedUser,
  ): Promise<Fight> {
    const existingFight = await this.fightRepository.findOneOrFail({
      where: { id, tournament: { userId: user.id } },
      relations: ['tournament'],
    });
    if (
      fight.boxer1Id !== existingFight.boxer1Id &&
      fight.boxer1Id !== existingFight.boxer2Id
    ) {
      throw new Error('Boxers not found in this fight');
    }
    if (
      fight.boxer2Id !== existingFight.boxer1Id &&
      fight.boxer2Id !== existingFight.boxer2Id
    ) {
      throw new Error('Boxers not found in this fight');
    }
    fight.tournamentId = existingFight.tournamentId;
    await this.fightRepository.update(id, toFight(fight));
    return this.fightRepository.findOneOrFail({
      where: { id },
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
