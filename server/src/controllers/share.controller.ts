import { Controller, Param, Inject, Get } from '@nestjs/common';
import { ShareService } from '../services/share.service';
import { ApiSharedFightCardGet } from '@/shared/types/api';

@Controller('share')
export class ShareController {
  constructor(
    @Inject()
    private readonly shareService: ShareService,
  ) {}

  @Get(':fightCardToken')
  async getFightsByFightCardToken(
    @Param('fightCardToken') fightCardToken: string,
  ): Promise<ApiSharedFightCardGet> {
    const res = await this.shareService.getByFightCardToken(fightCardToken);
    return res;
  }
}
