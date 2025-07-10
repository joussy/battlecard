import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { Fight } from '../entities/fight.entity';
import * as XLSX from 'xlsx';
import { stringify } from 'csv-stringify/sync';
import { ModalityService } from '../modality/modality.service';
import { GotenbergService } from './gotenberg.service';
import { TournamentBoxer } from '@/entities/tournament_boxer.entity';
import {
  toSelectorExportData,
  toSelectorTemplate,
} from '@/adapters/boxer.adapter';
import { generateSelectorHtml } from '@/templates/selector-html.template';

@Injectable()
export class SelectorExportService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Fight)
    private readonly tournamentBoxerRepository: Repository<TournamentBoxer>,
    private readonly modalityService: ModalityService,
    private readonly gotenbergService: GotenbergService,
  ) {}

  async generatePdf(tournamentId: string, boxerIds: string[]): Promise<Buffer> {
    const data = await this.getSelectorData(tournamentId, boxerIds);
    if (!data) {
      throw new Error('No boxers found for this tournament');
    }
    const template = toSelectorTemplate(
      data.boxers,
      data.tournament,
      this.modalityService.getModality(),
    );
    const html = generateSelectorHtml(template);
    return this.gotenbergService.generatePdf(html);
  }

  async generatePng(tournamentId: string, boxerIds: string[]): Promise<Buffer> {
    const data = await this.getSelectorData(tournamentId, boxerIds);
    if (!data) {
      throw new Error('No boxers found for this tournament');
    }
    const template = toSelectorTemplate(
      data.boxers,
      data.tournament,
      this.modalityService.getModality(),
    );
    const html = generateSelectorHtml(template);
    return this.gotenbergService.generatePng(html);
  }

  async generateCsv(tournamentId: string, boxerIds: string[]): Promise<string> {
    const { boxers } = await this.getSelectorData(tournamentId, boxerIds);
    if (!boxers || boxers.length === 0) {
      throw new Error('No boxers found for this tournament');
    }
    const csvData = toSelectorExportData(
      boxers,
      this.modalityService.getModality(),
    );
    return stringify(csvData);
  }

  async generateXlsx(
    tournamentId: string,
    boxerIds: string[],
  ): Promise<Buffer> {
    const { boxers, tournament } = await this.getSelectorData(
      tournamentId,
      boxerIds,
    );
    if (!boxers || boxers.length === 0) {
      throw new Error('No boxers found for this tournament');
    }
    const csvData = toSelectorExportData(
      boxers,
      this.modalityService.getModality(),
    );
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, tournament.name);
    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer;
  }

  async validateTournamentAccess(
    tournamentId: string,
    userId: string,
  ): Promise<void> {
    await this.tournamentRepository.findOneOrFail({
      where: { id: tournamentId, userId },
    });
  }

  private async getSelectorData(tournamentId: string, boxerIds: string[]) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
    });
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    if (boxerIds.length === 0) {
      throw new Error('No boxers selected');
    }

    const tournamentBoxers = await this.tournamentBoxerRepository.find({
      where: {
        tournamentId,
        boxerId: In(boxerIds),
      },
      relations: ['boxer'],
    });

    const boxers = tournamentBoxers.map((tb) => tb.boxer);

    return {
      boxers,
      tournament,
    };
  }
}
