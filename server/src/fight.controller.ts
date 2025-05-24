import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fight } from './entities/fight.entity';

@Controller('fights')
export class FightController {
  constructor(
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
  ) {}

  @Get()
  async findAll(): Promise<Fight[]> {
    return this.fightRepository.find();
  }

  @Post()
  async create(@Body() fight: Partial<Fight>): Promise<Fight> {
    if ('id' in fight) {
      delete fight.id;
    }
    return this.fightRepository.save(fight);
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
    @Body() fight: Partial<Fight>,
  ): Promise<Fight> {
    await this.fightRepository.update(id, fight);
    const updated = await this.fightRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException('Fight not found');
    return updated;
  }
}
