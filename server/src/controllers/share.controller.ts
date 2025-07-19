import {
  Controller,
  Param,
  Inject,
  Get,
  Post,
  Body,
  SetMetadata,
} from '@nestjs/common';
import { ShareService } from '../services/share.service';
import { ApiGeneratedToken, ApiSharedFightCardGet } from '@/shared/types/api';
import { User } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';

@Controller('share')
export class ShareController {
  constructor(
    @Inject()
    private readonly shareService: ShareService,
  ) {}

  @SetMetadata('isPublic', true)
  @Get('fightcard/:fightCardToken')
  async getFightsByFightCardToken(
    @Param('fightCardToken') fightCardToken: string,
  ): Promise<ApiSharedFightCardGet> {
    const res = await this.shareService.getByFightCardToken(fightCardToken);
    return res;
  }

  @Post('fightcard/generateRoToken')
  async generateFightCardToken(
    @Body() body: { tournamentId: string },
    @User() user: AuthenticatedUser,
  ): Promise<ApiGeneratedToken> {
    const token = await this.shareService.generateFightCardToken(
      body.tournamentId,
      user.id,
    );
    return { token };
  }
}
