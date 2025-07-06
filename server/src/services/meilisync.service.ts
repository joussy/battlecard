import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SyncLog } from '@/entities/sync-log.entity';
import { MeiliSearch } from 'meilisearch';
import { Boxer } from '@/entities/boxer.entity';
import { IndexedBoxer } from '@/interfaces/search.interface';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(SyncLog)
    private readonly syncLogRepo: Repository<SyncLog>,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
    private readonly dataSource: DataSource,
    @Inject('MEILI_CLIENT')
    private readonly meili: MeiliSearch,
  ) {}

  @Cron('*/2 * * * * *')
  async handleCron() {
    // this.logger.log('⏰ Running sync job');
    await this.syncUnprocessed();
  }

  @Cron('0 0 * * *')
  async fullSync() {
    this.logger.log('🔄 Running full sync job');
    const index = this.meili.index(process.env.MEILI_BOXER_INDEX || 'boxers');
    await index.deleteAllDocuments();
    const boxers = await this.boxerRepository.find();
    const indexedBoxers = boxers.map((boxer) => ({
      id: boxer.id,
      name: boxer.firstName + ' ' + boxer.lastName,
      weight: boxer.weight,
      birthDate: boxer.birthDate,
      club: boxer.club,
      license: boxer.license,
      gender: boxer.gender,
      nbFights: boxer.nbFights,
    }));
    if (indexedBoxers.length > 0) {
      await index.addDocuments(indexedBoxers);
      this.logger.log(`Full sync: ${indexedBoxers.length} boxers indexed`);
    } else {
      this.logger.log('Full sync: no boxers to index');
    }
  }

  async syncUnprocessed() {
    const logs = await this.syncLogRepo.find({
      where: { processed: false },
      order: { occurred_at: 'ASC' },
      take: 50,
    });

    for (const log of logs) {
      try {
        let boxer: IndexedBoxer | undefined;
        if (log.table_name === 'boxer' && log.operation !== 'DELETE') {
          boxer = await this.getBoxer(log.record_id);
        }
        await this.sendToMeili(log, boxer);
        log.processed = true;
        await this.syncLogRepo.save(log);
      } catch (err) {
        this.logger.error(`Failed to sync log ID ${log.id}: ${err}`);
      }
    }
  }

  private async getBoxer(id: string): Promise<IndexedBoxer | undefined> {
    const boxer = await this.boxerRepository.findOne({
      where: { id: id },
    });

    if (!boxer) {
      return undefined;
    }

    const indexedBoxer: IndexedBoxer = {
      id: boxer.id,
      name: boxer.firstName + ' ' + boxer.lastName,
      weight: boxer.weight,
      birthDate: boxer.birthDate,
      club: boxer.club,
      license: boxer.license,
      gender: boxer.gender,
      nbFights: boxer.nbFights,
    };

    return indexedBoxer;
  }

  private async sendToMeili(log: SyncLog, record: IndexedBoxer | undefined) {
    const index = this.meili.index(log.table_name);

    if (log.operation === 'DELETE') {
      await index.deleteDocument(log.record_id);
    } else if (record) {
      await index.addDocuments([record]);
    }

    this.logger.log(`${log.operation} → ${log.table_name} → ${log.record_id}`);
  }
}
