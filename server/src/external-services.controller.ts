import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { Fight } from './entities/fight.entity';
import { ConfigService } from '@nestjs/config';
import { Response as ExpressResponse } from 'express';
import { generateFightCardHtml } from './templates/fight-card-html.template';

@Controller('external')
export class ExternalServicesController {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    private readonly configService: ConfigService,
  ) {}

  @Get('importBoxerById')
  async importBoxerById(
    @Query('id') id: string,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    // Call Node-RED
    let response: Response;
    try {
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

  @Post('printCard')
  async getFightCardPdf(
    @Body() body: { tournamentId: string; fileType: string },
    @Res() res: ExpressResponse,
  ): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: body.tournamentId },
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found.' });
      return;
    }
    // Fetch fights for the tournament, including boxer names
    const fights = await this.fightRepository.find({
      where: { tournamentId: body.tournamentId },
      relations: ['boxer1', 'boxer2'],
      order: { order: 'ASC' },
    });
    if (!fights.length) {
      res.status(404).json({ error: 'No fights found for this tournament.' });
      return;
    }
    // Prepare HTML template
    const html = generateFightCardHtml(tournament, fights);
    console.log(html);
    // Send HTML to Gotenberg for PDF conversion
    const gotenbergUrl = this.configService.get<string>('GOTENBERG_URL');
    console.log('Gotenberg URL:', gotenbergUrl);
    if (!gotenbergUrl) {
      res.status(500).json({ error: 'PDF generation is not available.' });
      return;
    }
    const formData = new FormData();
    // Use Blob for browser and Node.js compatibility
    const htmlBlob = new Blob([html], { type: 'text/html' });
    formData.append('files', htmlBlob, 'index.html');
    formData.append('index.html', 'index.html');
    try {
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
}
