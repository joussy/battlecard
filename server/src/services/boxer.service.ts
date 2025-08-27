import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boxer } from '../entities/boxer.entity';
import { TournamentBoxer } from '../entities/tournament_boxer.entity';
import { Fight } from '../entities/fight.entity';
import { Tournament } from '@/entities/tournament.entity';
import { toBoxer, toBoxerDto } from '../adapters/boxer.adapter';
import { BoxerDto } from '@/dto/boxer.dto';
import { ModalityService } from '../modality/modality.service';
import { AuthenticatedUser } from '../interfaces/auth.interface';
import { CreateBoxerDto } from '@/dto/boxer.dto';
import { TournamentDto } from '@/dto/tournament.dto';
import { mockBoxers } from '../mock/boxers.mock';

@Injectable()
export class BoxerService {
  constructor(
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
    @InjectRepository(TournamentBoxer)
    private readonly tournamentBoxerRepository: Repository<TournamentBoxer>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    private readonly modalityService: ModalityService,
  ) {}

  async create(
    boxer: CreateBoxerDto,
    user: AuthenticatedUser,
  ): Promise<BoxerDto> {
    const tournament = await this.tournamentRepository.findOne({
      where: [{ id: boxer.tournamentId, userId: user.id }],
    });
    if (tournament?.userId !== user.id) {
      throw new NotFoundException(
        'Tournament not found or you do not have permission to access it',
      );
    }
    const dbBoxer = await this.boxerRepository.save(toBoxer(boxer, user.id));
    if (boxer.tournamentId) {
      const tournamentBoxer = new TournamentBoxer();
      tournamentBoxer.tournamentId = boxer.tournamentId;
      tournamentBoxer.boxerId = dbBoxer.id;
      await this.tournamentBoxerRepository.save(tournamentBoxer);
    }
    const modality = this.modalityService.getModality();
    return toBoxerDto(dbBoxer, modality);
  }

  async getBoxer(id: string, user: AuthenticatedUser): Promise<BoxerDto> {
    const dbBoxer = await this.boxerRepository.findOneOrFail({
      where: [{ id, userId: user.id }],
    });
    const modality = this.modalityService.getModality();
    const selectedFights = await this.fightRepository.count({
      where: [{ boxer1Id: id }, { boxer2Id: id }],
    });
    return toBoxerDto(dbBoxer, modality, selectedFights);
  }

  async getBoxersForUser(user: AuthenticatedUser): Promise<BoxerDto[]> {
    const dbBoxers = await this.boxerRepository.find({
      where: { userId: user.id },
    });
    const modality = this.modalityService.getModality();
    return dbBoxers.map((boxer) => toBoxerDto(boxer, modality));
  }

  async update(
    boxerId: string,
    boxer: CreateBoxerDto,
    user: AuthenticatedUser,
  ): Promise<BoxerDto> {
    await this.boxerRepository.findOneOrFail({
      where: [{ id: boxerId, userId: user.id }],
    });
    await this.boxerRepository.update(boxerId, toBoxer(boxer, user.id));
    const updated = await this.boxerRepository.findOneBy({ id: boxerId });
    if (!updated) throw new NotFoundException('Boxer not found');
    const modality = this.modalityService.getModality();
    return toBoxerDto(updated, modality);
  }

  async createFakeForTournament(
    tournament: TournamentDto,
    user: AuthenticatedUser,
  ) {
    // Create multiple boxers from mock data for the tournament
    for (const mockBoxer of mockBoxers) {
      const boxer: CreateBoxerDto = {
        firstName: mockBoxer.firstName!,
        lastName: mockBoxer.lastName!,
        weight: mockBoxer.weight,
        birthDate: mockBoxer.birthDate!,
        tournamentId: tournament.id,
        club: mockBoxer.club!,
        gender: mockBoxer.gender!,
        license: mockBoxer.license!,
        nbFights: mockBoxer.nbFights || 0,
      };
      await this.create(boxer, user);
    }
  }
}
