import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { User } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { FightExportService } from '@/services/fight-export.service';
import { TournamentService } from '@/services/tournament.service';
import { SelectorExportService } from '@/services/selector-export.service';

@Controller('export')
export class ExternalServicesController {
  constructor(
    private readonly externalServicesService: FightExportService,
    private readonly tournamentService: TournamentService,
    private readonly selectorExportService: SelectorExportService,
  ) {}

  @Post('fightcard/pdf')
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

  @Post('fightcard/png')
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

  @Post('selector/battlecard')
  async getBattlecard(
    @Body() body: { tournamentId: string; boxerIds: string[] },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ) {
    try {
      await this.tournamentService.validateTournamentAccess(
        body.tournamentId,
        user.id,
      );
      const csvContent = await this.selectorExportService.generateBattlecard(
        body.tournamentId,
        body.boxerIds,
      );
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=battlecard-${body.tournamentId}.csv`,
      );
      res.send(csvContent);
    } catch (err) {
      console.error('Error generating CSV:', err);
      res.status(502).json({ error: 'Error generating CSV.' });
    }
  }

  @Post('fightcard/csv')
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

  @Post('fightcard/xlsx')
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

  @Post('selector/pdf')
  async getSelectorPdf(
    @Body() body: { tournamentId: string; boxerIds: string[] },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      await this.tournamentService.validateTournamentAccess(
        body.tournamentId,
        user.id,
      );
      const pdfBuffer = await this.selectorExportService.generatePdf(
        body.tournamentId,
        body.boxerIds,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="selector.pdf"',
      );
      res.send(pdfBuffer);
    } catch (err) {
      console.error('Error generating selector PDF:', err);
      res.status(502).json({ error: 'Error generating selector PDF.' });
    }
  }

  @Post('selector/png')
  async getSelectorPng(
    @Body() body: { tournamentId: string; boxerIds: string[] },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      await this.tournamentService.validateTournamentAccess(
        body.tournamentId,
        user.id,
      );
      const pngBuffer = await this.selectorExportService.generatePng(
        body.tournamentId,
        body.boxerIds,
      );
      res.setHeader('Content-Type', 'image/png');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="selector.png"',
      );
      res.send(pngBuffer);
    } catch (err) {
      console.error('Error generating selector PNG:', err);
      res.status(502).json({ error: 'Error generating selector PNG.' });
    }
  }

  @Post('selector/csv')
  async getSelectorCsv(
    @Body() body: { tournamentId: string; boxerIds: string[] },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      await this.tournamentService.validateTournamentAccess(
        body.tournamentId,
        user.id,
      );
      const csvContent = await this.selectorExportService.generateCsv(
        body.tournamentId,
        body.boxerIds,
      );
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="selector.csv"',
      );
      res.send(csvContent);
    } catch (err) {
      console.error('Error generating selector CSV:', err);
      res.status(502).json({ error: 'Error generating selector CSV.' });
    }
  }

  @Post('selector/xlsx')
  async getSelectorXlsx(
    @Body() body: { tournamentId: string; boxerIds: string[] },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    try {
      await this.tournamentService.validateTournamentAccess(
        body.tournamentId,
        user.id,
      );
      const xlsxBuffer = await this.selectorExportService.generateXlsx(
        body.tournamentId,
        body.boxerIds,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="selector.xlsx"',
      );
      res.send(xlsxBuffer);
    } catch (err) {
      console.error('Error generating selector XLSX:', err);
      res.status(502).json({ error: 'Error generating selector XLSX.' });
    }
  }
}
