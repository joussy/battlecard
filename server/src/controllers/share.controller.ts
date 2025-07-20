import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  SetMetadata,
  Res,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ShareService } from '@/services/share.service';
import { ApiGeneratedToken } from '@/shared/types/api';
import { User } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { FightExportService } from '@/services/fight-export.service';
import { QrCodeService } from '@/services/qrcode.service';

@Controller('share')
export class ShareController {
  constructor(
    private readonly shareService: ShareService,
    private readonly fightExportService: FightExportService,
    private readonly qrCodeService: QrCodeService,
  ) {}

  @SetMetadata('isPublic', true)
  @Get('fightcard/:fightCardToken')
  async getFightsByFightCardToken(
    @Param('fightCardToken') fightCardToken: string,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      const data =
        await this.shareService.getTournamentByFightCardToken(fightCardToken);
      res.json(data);
    } catch (err) {
      console.error('Error fetching shared fight card:', err);
      res.status(403).json({ error: 'Forbidden' });
    }
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
    const url = this.shareService.getFightCardShareUrl(token);
    const qrcode = await this.qrCodeService.generatePngFromUrl(url);
    return { token, qrcode, url };
  }

  @SetMetadata('isPublic', true)
  @Post('fightcard/xlsx')
  async downloadSharedFightCardXlsx(
    @Body() body: { fightCardToken: string },
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
  @SetMetadata('isPublic', true)
  @Post('fightcard/pdf')
  async downloadSharedFightCardPdf(
    @Body() body: { fightCardToken: string },
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      const tournamentId = this.shareService.getTournamentIdByFightCardToken(
        body.fightCardToken,
      );
      const pdfBuffer = await this.fightExportService.generatePdf(
        tournamentId,
        false,
      );
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
  @SetMetadata('isPublic', true)
  @Post('fightcard/png')
  async downloadSharedFightCardPng(
    @Body() body: { fightCardToken: string },
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      const tournamentId = this.shareService.getTournamentIdByFightCardToken(
        body.fightCardToken,
      );
      const pngBuffer = await this.fightExportService.generatePng(
        tournamentId,
        false,
      );
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
  @SetMetadata('isPublic', true)
  @Post('fightcard/csv')
  async downloadSharedFightCardCsv(
    @Body() body: { fightCardToken: string },
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
