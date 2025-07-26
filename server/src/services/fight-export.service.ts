import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { Fight } from '../entities/fight.entity';
import * as XLSX from 'xlsx';
import { stringify } from 'csv-stringify/sync';
import { ModalityService } from '../modality/modality.service';
import {
  toFightCardExportData,
  toFightCardTemplate,
} from '../adapters/fight.adapter';
import { GotenbergService } from './gotenberg.service';
import { QrCodeService } from './qrcode.service';
import { TemplateService } from './template.service';

@Injectable()
export class FightExportService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    private readonly modalityService: ModalityService,
    private readonly gotenbergService: GotenbergService,
    private readonly qrCodeService: QrCodeService,
    private readonly templateService: TemplateService,
  ) {}

  async generatePdf(
    tournamentId: string,
    fightCardShareUrl?: string,
  ): Promise<Buffer> {
    const { fights, tournament, svgQrCode } = await this.getFightCardData(
      tournamentId,
      fightCardShareUrl,
    );
    const template = toFightCardTemplate(
      fights,
      tournament,
      this.modalityService.getModality(),
      svgQrCode,
    );
    const html = this.templateService.generateFightCardHtml(template);

    return this.gotenbergService.generatePdf(html);
  }
  async generateHtml(tournamentId: string): Promise<string> {
    const { fights, tournament } = await this.getFightCardData(tournamentId);
    const template = toFightCardTemplate(
      fights,
      tournament,
      this.modalityService.getModality(),
    );
    const html = this.templateService.generateFightCardHtml(template);

    return html;
  }

  async generatePng(
    tournamentId: string,
    fightCardShareUrl?: string,
  ): Promise<Buffer> {
    const { fights, tournament, svgQrCode } = await this.getFightCardData(
      tournamentId,
      fightCardShareUrl,
    );
    const template = toFightCardTemplate(
      fights,
      tournament,
      this.modalityService.getModality(),
      svgQrCode,
    );
    const html = this.templateService.generateFightCardHtml(template);

    return this.gotenbergService.generatePng(html);
  }

  async generateCsv(tournamentId: string): Promise<string> {
    const { fights } = await this.getFightCardData(tournamentId);
    const data = toFightCardExportData(fights);
    if (!data) {
      throw new Error('No fights found for this tournament');
    }
    return stringify(data);
  }

  async generateXlsx(tournamentId: string): Promise<Buffer> {
    const { fights } = await this.getFightCardData(tournamentId);
    const data = toFightCardExportData(fights);
    if (!data) {
      throw new Error('No fights found for this tournament');
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fight Card');
    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer;
  }

  private async getFightCardData(
    tournamentId: string,
    fightCardShareUrl?: string,
  ) {
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

    let svgQrCode: string | undefined;
    if (fightCardShareUrl) {
      svgQrCode =
        await this.qrCodeService.generateSvgFromUrl(fightCardShareUrl);
    }

    return {
      fights,
      tournament,
      svgQrCode,
    };
  }
}
