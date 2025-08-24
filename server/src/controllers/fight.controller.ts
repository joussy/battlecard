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
import { FightService } from '../services/fight.service';
import { FightDto } from '@/dto/fight.dto';
import {
  CreateFightDto,
  ReorderFightDto,
  SwitchFightDto,
  DeleteFightsDto,
} from '@/dto/fight.dto';
import { TournamentIdParamsDto } from '@/dto/params.dto';
import { User } from '@/decorators/auth.decorator';
import { toFightDto } from '@/adapters/fight.adapter';

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
    @Body() fight: CreateFightDto,
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
      return res.json(toFightDto(dbFight, modality));
    } catch (err) {
      if (err instanceof Error && err.message.includes('already exists')) {
        return res.status(409).json({ error: err.message });
      }
      throw err;
    }
  }

  @Delete()
  async deleteMany(
    @Body() dto: DeleteFightsDto,
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    const fight = await this.fightService.findById(dto.ids[0], user);
    await this.fightService.deleteMany(dto.ids, user);
    await this.fightService.reorderFights(fight.tournamentId, user);
  }

  @Post('reorder')
  async reorderFight(
    @Body() body: ReorderFightDto,
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    return this.fightService.reorderFight(body.fightId, body.newIndex, user);
  }

  @Post('switch')
  async switch(
    @Body() body: SwitchFightDto,
    @User() user: AuthenticatedUser,
  ): Promise<FightDto> {
    const updated = await this.fightService.switch(body.fightId, user);
    return toFightDto(updated, this.modalityService.getModality());
  }

  @Get('matchups/:tournamentId')
  async getMatchups(
    @User() user: AuthenticatedUser,
    @Param() params: TournamentIdParamsDto,
  ): Promise<FightDto[]> {
    const fights = await this.fightService.getMatchups(
      params.tournamentId,
      user,
    );
    return fights;
  }
}
