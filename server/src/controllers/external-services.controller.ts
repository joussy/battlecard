import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { Fight } from '../entities/fight.entity';
import { ConfigService } from '@nestjs/config';
import { Response as ExpressResponse } from 'express';
import { generateFightCardHtml } from '../templates/fight-card-html.template';
import * as XLSX from 'xlsx';
import { stringify } from 'csv-stringify/sync';
import { ModalityService } from '../modality/modality.service';
import { toFightCardTemplate } from '../adapters/fight.adapter';
import { User } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth.interface';

@Controller('external')
export class ExternalServicesController {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    private readonly configService: ConfigService,
    private readonly modalityService: ModalityService,
  ) {}

  @Get('importBoxerById')
  async importBoxerById(
    @Query('id') id: string,
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    let response: Response;
    try {
      if (!user.apiEnabled) {
        console.error('API access is not enabled for user:', user.id);
        res.status(403).json({ error: 'API access is not enabled' });
        return;
      }
      console.log('Calling Node-RED to import boxer by ID:', id);
      response = await fetch(
        `${this.configService.get<string>('NODERED_HOST')}/battlecard/getById?id=${id}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } catch (err: any) {
      console.error('Error calling Node-RED:', err);
      res.status(502).json({ error: 'Failed to reach Node-RED' });
      return;
    }
    if (!response) {
      console.error('Node-RED response error:', response);
      res.status(502).json({ error: 'Node-RED error.' });
      return;
    }
    const contentType =
      response.headers.get('content-type') || 'application/octet-stream';
    const arrBuf = await response.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    res.send(Buffer.from(arrBuf));
  }

  @Post('generatePdf')
  async getFightCardPdf(
    @Body() body: { tournamentId: string },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    await this.tournamentRepository.findOneOrFail({
      where: { id: body.tournamentId, userId: user.id },
    });
    const html = await this.getHtml(body.tournamentId);
    const formData = new FormData();
    // Use Blob for browser and Node.js compatibility
    const htmlBlob = new Blob([html], { type: 'text/html' });
    formData.append('files', htmlBlob, 'index.html');
    formData.append('index.html', 'index.html');
    formData.append('landscape', 'true');
    try {
      // Send HTML to Gotenberg for PDF conversion
      const gotenbergUrl = this.configService.get<string>('GOTENBERG_URL');
      if (!gotenbergUrl) {
        throw new Error('Pdf generation service not available');
      }

      const gotenbergRes = await fetch(
        `${gotenbergUrl}/forms/chromium/convert/html`,
        {
          method: 'POST',
          body: formData,
        },
      );
      if (!gotenbergRes.ok) {
        console.error('Gotenberg response error:', gotenbergRes.statusText);
        res
          .status(502)
          .json({ error: 'Failed to generate PDF with Gotenberg.' });
        return;
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="fight-card.pdf"',
      );
      const pdfBuffer = Buffer.from(await gotenbergRes.arrayBuffer());
      res.send(pdfBuffer);
    } catch (err) {
      console.error('Error connecting to Gotenberg:', err);
      res.status(502).json({ error: 'Error connecting to Gotenberg.' });
    }
  }

  @Post('generatePng')
  async getFightCardPng(
    @Body() body: { tournamentId: string },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    await this.tournamentRepository.findOneOrFail({
      where: { id: body.tournamentId, userId: user.id },
    });
    const html = await this.getHtml(body.tournamentId);
    const formData = new FormData();
    // Use Blob for browser and Node.js compatibility
    const htmlBlob = new Blob([html], { type: 'text/html' });
    formData.append('files', htmlBlob, 'index.html');
    formData.append('index.html', 'index.html');
    formData.append('clip', 'false');
    formData.append('skipNetworkIdleEvent', 'false');
    try {
      // Send HTML to Gotenberg for PNG conversion
      const gotenbergUrl = this.configService.get<string>('GOTENBERG_URL');
      console.log('Gotenberg URL:', gotenbergUrl);
      if (!gotenbergUrl) {
        throw new Error('Image generation service not available');
      }

      const gotenbergRes = await fetch(
        `${gotenbergUrl}/forms/chromium/screenshot/html`,
        {
          method: 'POST',
          body: formData,
        },
      );
      if (!gotenbergRes.ok) {
        console.error('Gotenberg response error:', gotenbergRes.statusText);
        res
          .status(502)
          .json({ error: 'Failed to generate PNG with Gotenberg.' });
        return;
      }
      res.setHeader('Content-Type', 'image/png');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="fight-card.png"',
      );
      const pngBuffer = Buffer.from(await gotenbergRes.arrayBuffer());
      res.send(pngBuffer);
    } catch (err) {
      console.error('Error connecting to Gotenberg:', err);
      res.status(502).json({ error: 'Error connecting to Gotenberg.' });
    }
  }

  @Post('generateCsv')
  async getFightCardCsv(
    @Body() body: { tournamentId: string },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    await this.tournamentRepository.findOneOrFail({
      where: { id: body.tournamentId, userId: user.id },
    });

    const data = await this.getFightCardData(body.tournamentId);
    if (!data) {
      res.status(404).json({ error: 'No fights found for this tournament' });
      return;
    }
    const csvContent = stringify(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="fight-card.csv"',
    );
    res.send(csvContent);
  }

  @Post('generateXlsx')
  async getFightCardXlsx(
    @Body() body: { tournamentId: string },
    @User() user: AuthenticatedUser,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    await this.tournamentRepository.findOneOrFail({
      where: { id: body.tournamentId, userId: user.id },
    });
    const data = await this.getFightCardData(body.tournamentId);
    if (!data) {
      res.status(404).json({ error: 'No fights found for this tournament' });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fight Card');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const xlsxBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="fight-card.xlsx"',
    );
    res.send(xlsxBuffer);
  }

  private async getHtml(tournamentId: string): Promise<string> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
    });
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    // Fetch fights for the tournament, including boxer names
    const fights = await this.fightRepository.find({
      where: { tournamentId },
      relations: ['boxer1', 'boxer2'],
      order: { order: 'ASC' },
    });
    if (!fights.length) {
      throw new Error('No fights found for this tournament');
    }

    // Prepare HTML template
    const template = toFightCardTemplate(
      fights,
      tournament,
      this.modalityService.getModality(),
    );
    const html = generateFightCardHtml(template);
    return html;
  }

  private async getFightCardData(tournamentId: string) {
    const fights = await this.fightRepository.find({
      where: { tournamentId },
      relations: ['boxer1', 'boxer2'],
      order: { order: 'ASC' },
    });
    if (!fights || !fights.length) {
      return null;
    }
    return fights.map((fight) => ({
      Order: fight.order,
      'Red Licence': `${fight.boxer1?.license}`,
      'Red Boxer':
        `${fight.boxer1?.firstName || ''} ${fight.boxer1?.lastName || ''}`.trim(),
      'Red Club': fight.boxer1?.club || '',
      'Blue Licence': `${fight.boxer2?.license}`,
      'Blue Boxer':
        `${fight.boxer2?.firstName || ''} ${fight.boxer2?.lastName || ''}`.trim(),
      'Blue Club': fight.boxer2?.club || '',
    }));
  }
}
