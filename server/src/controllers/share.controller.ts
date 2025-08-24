import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { ShareService } from '@/services/share.service';
import { GeneratedTokenDto } from '@/dto/share.dto';
import { SharedFightCardDto } from '@/dto/tournament.dto';
import { Response as ExpressResponse } from 'express';
import { User } from '@/decorators/auth.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { FightExportService } from '@/services/fight-export.service';
import { QrCodeService } from '@/services/qrcode.service';
import { FightCardTokenParamsDto } from '@/dto/params.dto';
import { GenerateFightCardTokenDto, FightCardTokenDto } from '@/dto/share.dto';
import { NoAuthRequired } from '@/decorators/auth.decorator';
import {
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('share')
@Controller('share')
export class ShareController {
  constructor(
    private readonly shareService: ShareService,
    private readonly fightExportService: FightExportService,
    private readonly qrCodeService: QrCodeService,
  ) {}

  @NoAuthRequired()
  @Get('fightcard/:fightCardToken')
  @ApiOkResponse({ type: SharedFightCardDto })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getFightsByFightCardToken(
    @Param() params: FightCardTokenParamsDto,
  ): Promise<SharedFightCardDto> {
    try {
      const data = await this.shareService.getTournamentByFightCardToken(
        params.fightCardToken,
      );
      return data;
    } catch (err) {
      console.error('Error fetching shared fight card:', err);
      throw new ForbiddenException('Forbidden');
    }
  }

  @Post('fightcard/generateRoToken')
  async generateFightCardToken(
    @Body() body: GenerateFightCardTokenDto,
    @User() user: AuthenticatedUser,
  ): Promise<GeneratedTokenDto> {
    const token = await this.shareService.generateFightCardToken(
      body.tournamentId,
      user.id,
    );
    const url = this.shareService.getFightCardShareUrl(token);
    const qrcode = await this.qrCodeService.generatePngFromUrl(url);
    return { token, qrcode, url };
  }

  @NoAuthRequired()
  @Post('fightcard/xlsx')
  @ApiResponse({
    status: 200,
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  async downloadSharedFightCardXlsx(
    @Body() body: FightCardTokenDto,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      const tournamentId = this.shareService.getTournamentIdByFightCardToken(
        body.fightCardToken,
      );
      const xlsxBuffer =
        await this.fightExportService.generateXlsx(tournamentId);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="fight-card.xlsx"',
      );
      res.send(xlsxBuffer);
    } catch (err) {
      console.error('Error generating XLSX:', err);
      res.status(502).json({ error: 'Error generating XLSX.' });
    }
  }
  @NoAuthRequired()
  @Post('fightcard/pdf')
  @ApiResponse({
    status: 200,
    content: {
      'application/pdf': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  async downloadSharedFightCardPdf(
    @Body() body: FightCardTokenDto,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      const tournamentId = this.shareService.getTournamentIdByFightCardToken(
        body.fightCardToken,
      );
      const pdfBuffer = await this.fightExportService.generatePdf(tournamentId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="fight-card.pdf"',
      );
      res.send(pdfBuffer);
    } catch (err) {
      console.error('Error generating PDF:', err);
      res.status(502).json({ error: 'Error generating PDF.' });
    }
  }
  @NoAuthRequired()
  @Post('fightcard/png')
  @ApiResponse({
    status: 200,
    content: {
      'image/png': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  async downloadSharedFightCardPng(
    @Body() body: FightCardTokenDto,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      const tournamentId = this.shareService.getTournamentIdByFightCardToken(
        body.fightCardToken,
      );
      const pngBuffer = await this.fightExportService.generatePng(tournamentId);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="fight-card.png"',
      );
      res.send(pngBuffer);
    } catch (err) {
      console.error('Error generating PNG:', err);
      res.status(502).json({ error: 'Error generating PNG.' });
    }
  }
  @NoAuthRequired()
  @Post('fightcard/csv')
  @ApiResponse({
    status: 200,
    content: {
      'text/csv': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  async downloadSharedFightCardCsv(
    @Body() body: FightCardTokenDto,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      const tournamentId = this.shareService.getTournamentIdByFightCardToken(
        body.fightCardToken,
      );
      const csvBuffer = await this.fightExportService.generateCsv(tournamentId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="fight-card.csv"',
      );
      res.send(csvBuffer);
    } catch (err) {
      console.error('Error generating CSV:', err);
      res.status(502).json({ error: 'Error generating CSV.' });
    }
  }
}
