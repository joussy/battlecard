import {
  Controller,
  Post,
  Delete,
  Body,
  Res,
  Inject,
  Get,
  Param,
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
      const modality = this.modalityService.getModality();
      return res.json(toApiFight(dbFight, modality));
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

  @Post('switch')
  async switch(
    @Body() body: { fightId: string },
    @User() user: AuthenticatedUser,
  ): Promise<ApiFightGet> {
    const updated = await this.fightService.switch(body.fightId, user);
    return toApiFight(updated, this.modalityService.getModality());
  }

  @Get('matchups/:tournamentId')
  async getMatchups(
    @User() user: AuthenticatedUser,
    @Param('tournamentId') tournamentId: string,
  ): Promise<ApiFightGet[]> {
    const fights = await this.fightService.getMatchups(tournamentId, user);
    return fights;
  }
}
