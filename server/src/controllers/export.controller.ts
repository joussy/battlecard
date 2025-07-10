import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { User } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { TournamentExportService } from '@/services/tournament-export.service';
import { TournamentService } from '@/services/tournament.service';

@Controller('external')
export class ExternalServicesController {
  constructor(
    private readonly externalServicesService: TournamentExportService,
    private readonly tournamentService: TournamentService,
  ) {}

  @Post('generatePdf')
  async getFightCardPdf(
    @Body() body: { tournamentId: string },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      await this.tournamentService.validateTournamentAccess(
        body.tournamentId,
        user.id,
      );
      const pdfBuffer = await this.externalServicesService.generatePdf(
        body.tournamentId,
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

  @Post('generatePng')
  async getFightCardPng(
    @Body() body: { tournamentId: string },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      await this.tournamentService.validateTournamentAccess(
        body.tournamentId,
        user.id,
      );
      const pngBuffer = await this.externalServicesService.generatePng(
        body.tournamentId,
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

  @Post('generateCsv')
  async getFightCardCsv(
    @Body() body: { tournamentId: string },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      await this.tournamentService.validateTournamentAccess(
        body.tournamentId,
        user.id,
      );
      const csvContent = await this.externalServicesService.generateCsv(
        body.tournamentId,
      );
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="fight-card.csv"',
      );
      res.send(csvContent);
    } catch (err) {
      console.error('Error generating CSV:', err);
      res.status(502).json({ error: 'Error generating CSV.' });
    }
  }

  @Post('generateXlsx')
  async getFightCardXlsx(
    @Body() body: { tournamentId: string },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      await this.tournamentService.validateTournamentAccess(
        body.tournamentId,
        user.id,
      );
      const xlsxBuffer = await this.externalServicesService.generateXlsx(
        body.tournamentId,
      );
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
}
