import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { Fight } from '../entities/fight.entity';
import { ApiSharedFightCardGet } from '@/shared/types/api';
import { decryptToken, encryptToken } from '@/utils/crypto.utils';
import { toApiSharedFightCardGet } from '@/adapters/share.adapter';
import { ModalityService } from '@/modality/modality.service';
import { ConfigService } from '@/services/config.service';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    private readonly modalityService: ModalityService,
    private readonly configService: ConfigService,
  ) {}

  private get secretKey(): string {
    return this.configService.getFightCardShareSecret();
  }

  getTournamentIdByFightCardToken(fightCardToken: string): string {
    const tournamentId = decryptToken(this.secretKey, fightCardToken);

    return tournamentId;
  }

  async getTournamentByFightCardToken(
    fightCardToken: string,
  ): Promise<ApiSharedFightCardGet> {
    const tournamentId = decryptToken(this.secretKey, fightCardToken);
    const tournament = await this.tournamentRepository.findOneOrFail({
      where: { id: tournamentId },
    });
    const fights = await this.fightRepository.find({
      where: { tournamentId },
      relations: ['boxer1', 'boxer2'],
      order: { order: 'ASC' }, // Ensure fights are ordered by their fight order
    });
    const modality = this.modalityService.getModality();
    const sharedFightCard = toApiSharedFightCardGet(
      tournament,
      fights,
      modality,
    );

    return sharedFightCard;
  }

  async generateFightCardToken(
    tournamentId: string,
    userId: string,
  ): Promise<string> {
    await this.tournamentRepository.findOneOrFail({
      where: { id: tournamentId, userId },
    });
    const token = encryptToken(this.secretKey, tournamentId);
    return token;
  }
  getFightCardShareUrl(token: string): string {
    return `${this.configService.getConfig().websiteBaseUrl}/#/shared-card/${token}`;
  }
}
