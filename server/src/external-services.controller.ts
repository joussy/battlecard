import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { Fight } from './entities/fight.entity';
import { ConfigService } from '@nestjs/config';
import { Response as ExpressResponse } from 'express';

@Controller('external')
export class ExternalServicesController {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    private readonly configService: ConfigService,
  ) {}

  @Post('printCard')
  async printCard(
    @Body() body: { tournamentId: string; fileType: string },
    @Res() res: ExpressResponse,
  ): Promise<void> {
    const { tournamentId, fileType } = body;
    // Fetch tournament
    const tournament = await this.tournamentRepository.findOneBy({
      id: tournamentId,
    });
    if (!tournament) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    // Fetch fights for tournament, including boxer1 and boxer2 details
    const fights = await this.fightRepository.find({
      where: { tournamentId },
      relations: ['boxer1', 'boxer2'],
    });
    // Prepare payload for Node-RED
    const payload = {
      fights,
      fileType,
      title: tournament.name,
    };
    // Call Node-RED
    let response: Response;
    try {
      response = await fetch(
        `${this.configService.get<string>('NODERED_HOST')}/battlecard/fightsToFile`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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
}
