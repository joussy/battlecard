import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  NotFoundException,
  Res,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Fight } from '../entities/fight.entity';
import { toFight, toApiFight } from '../adapters/fight.adapter';
import { ApiFightGet, ApiFightCreate } from '@/shared/types/api';
import { Response } from 'express';
import { ModalityService } from '../modality/modality.service';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { User } from '@/decorators/user.decorator';
import { Boxer } from '@/entities/boxer.entity';

@Controller('fights')
export class FightController {
  constructor(
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
    @Inject()
    private readonly modalityService: ModalityService,
  ) {}

  @Get()
  async findAll(@User() user: AuthenticatedUser): Promise<ApiFightGet[]> {
    const dbFights = await this.fightRepository.find({
      where: { tournament: { userId: user.id } },
      order: { order: 'ASC' },
      relations: ['boxer1', 'boxer2', 'tournament'],
    });
    const modality = this.modalityService.getModality();
    const fights = dbFights.map((fight) => {
      const fightDuration = modality.getFightDuration(
        fight.boxer1,
        fight.boxer2,
      );
      return toApiFight(fight, fightDuration);
    });
    return fights;
  }

  @Post()
  async create(
    @Body() fight: ApiFightCreate,
    @User() user: AuthenticatedUser,
    @Res() res: Response,
  ): Promise<any> {
    await this.boxerRepository.findOneOrFail({
      where: [{ id: fight.boxer1Id }, { userId: user.id }],
    });
    await this.boxerRepository.findOneOrFail({
      where: [{ id: fight.boxer2Id }, { userId: user.id }],
    });
    // Check if a fight already exists between these two boxers in the same tournament
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
      return res.status(409).json({
        error:
          'A fight between these two boxers already exists in this tournament.',
      });
    }
    await this.fightRepository.save(toFight(fight as ApiFightGet));
    const dbFight = await this.fightRepository.findOne({
      where: {
        boxer1Id: fight.boxer1Id,
        boxer2Id: fight.boxer2Id,
        tournamentId: fight.tournamentId,
      },
      relations: ['boxer1', 'boxer2'],
    });
    if (!dbFight) {
      return res.status(404).json({ error: 'Fight not found' });
    }
    const fightDuration = this.modalityService
      .getModality()
      .getFightDuration(dbFight.boxer1, dbFight.boxer2);
    return res.json(toApiFight(dbFight, fightDuration));
  }

  @Delete()
  async deleteMany(
    @Body('ids') fightIds: string[],
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    if (!Array.isArray(fightIds) || fightIds.length === 0) return;
    const fights = await this.fightRepository.find({
      where: { id: In(fightIds), tournament: { userId: user.id } },
      relations: ['tournament'],
    });
    await this.fightRepository.delete(fights.map((f) => f.id));
  }

  @Post('reorder')
  async reorderFights(
    @Body() body: { fightIds: string[]; tournamentId: string },
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    const { fightIds, tournamentId } = body;
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() fight: ApiFightGet,
    @User() user: AuthenticatedUser,
  ): Promise<ApiFightGet> {
    const existingFight = await this.fightRepository.findOneOrFail({
      where: { id, tournament: { userId: user.id } },
      relations: ['tournament'],
    });
    if (
      fight.boxer1Id !== existingFight.boxer1Id &&
      fight.boxer1Id !== existingFight.boxer2Id
    ) {
      throw new NotFoundException('Boxers not found in this fight');
    }
    if (
      fight.boxer2Id !== existingFight.boxer1Id &&
      fight.boxer2Id !== existingFight.boxer2Id
    ) {
      throw new NotFoundException('Boxers not found in this fight');
    }

    fight.tournamentId = existingFight.tournamentId;
    await this.fightRepository.update(id, toFight(fight));
    const updated = await this.fightRepository.findOneOrFail({
      where: { id },
      relations: ['boxer1', 'boxer2'],
    });
    if (!updated) throw new NotFoundException('Fight not found');
    const fightDuration = this.modalityService
      .getModality()
      .getFightDuration(updated.boxer1, updated.boxer2);
    return toApiFight(updated, fightDuration);
  }
}
