import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  Res,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { ModalityService } from '../modality/modality.service';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { User } from '@/decorators/user.decorator';
import { FightService } from '../services/fight.service';
import { toApiFight } from '../adapters/fight.adapter';
import { ApiFightGet, ApiFightCreate } from '@/shared/types/api';

@Controller('fights')
export class FightController {
  constructor(
    @Inject()
    private readonly fightService: FightService,
    @Inject()
    private readonly modalityService: ModalityService,
  ) {}

  @Get()
  async findAll(@User() user: AuthenticatedUser): Promise<ApiFightGet[]> {
    return this.fightService.findAll(user);
  }

  @Post()
  async create(
    @Body() fight: ApiFightCreate,
    @User() user: AuthenticatedUser,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.fightService.create(fight, user);
      // Find the fight by boxer1Id, boxer2Id, and tournamentId
      const dbFight = await this.fightService.findByBoxersAndTournament(
        fight.boxer1Id,
        fight.boxer2Id,
        fight.tournamentId,
      );
      if (!dbFight) {
        return res.status(404).json({ error: 'Fight not found' });
      }
      const fightDuration = this.modalityService
        .getModality()
        .getFightDuration(dbFight.boxer1, dbFight.boxer2);
      return res.json(toApiFight(dbFight, fightDuration));
    } catch (err) {
      if (err instanceof Error && err.message.includes('already exists')) {
        return res.status(409).json({ error: err.message });
      }
      throw err;
    }
  }

  @Delete()
  async deleteMany(
    @Body('ids') fightIds: string[],
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    const fight = await this.fightService.findById(fightIds[0], user);
    await this.fightService.deleteMany(fightIds, user);
    await this.fightService.reorderFights(fight.tournamentId, user);
  }

  @Post('reorder')
  async reorderFight(
    @Body() body: { fightId: string; newIndex: number },
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    return this.fightService.reorderFight(body.fightId, body.newIndex, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() fight: ApiFightGet,
    @User() user: AuthenticatedUser,
  ): Promise<ApiFightGet> {
    const updated = await this.fightService.update(id, fight, user);
    const fightDuration = this.modalityService
      .getModality()
      .getFightDuration(updated.boxer1, updated.boxer2);
    return toApiFight(updated, fightDuration);
  }
}
