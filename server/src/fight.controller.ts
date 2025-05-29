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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fight } from './entities/fight.entity';
import { toFight, toApiFight } from './adapters/fight.adapter';
import { ApiFight } from '@/shared/types/api';
import { Response } from 'express';

@Controller('fights')
export class FightController {
  constructor(
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
  ) {}

  @Get()
  async findAll(): Promise<ApiFight[]> {
    const dbFights = await this.fightRepository.find();
    return dbFights.map(toApiFight);
  }

  @Post()
  async create(
    @Body() fight: Partial<ApiFight>,
    @Res() res: Response,
  ): Promise<any> {
    if ('id' in fight) {
      delete fight.id;
    }
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
    const dbFight = await this.fightRepository.save(toFight(fight as ApiFight));
    return res.json(toApiFight(dbFight));
  }

  @Delete()
  async deleteMany(@Body('ids') ids: string[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) return;
    await this.fightRepository.delete(ids);
  }

  @Post('reorder')
  async reorderFights(
    @Body() body: { fightIds: string[]; tournamentId: string },
  ): Promise<void> {
    const { fightIds, tournamentId } = body;
    if (!Array.isArray(fightIds) || !tournamentId) return;
    const allFights = await this.fightRepository.find({
      where: { tournamentId },
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
    @Body() fight: Partial<ApiFight>,
  ): Promise<ApiFight> {
    await this.fightRepository.update(id, toFight(fight as ApiFight));
    const updated = await this.fightRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException('Fight not found');
    return toApiFight(updated);
  }
}
