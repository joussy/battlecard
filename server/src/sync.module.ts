import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncLog } from '@/entities/sync-log.entity';
import { SyncService } from '@/services/meilisync.service';
import { MeiliSearchProvider } from './providers/meilisearch.provider';
import { Boxer } from '@/entities/boxer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SyncLog, Boxer])],
  providers: [SyncService, MeiliSearchProvider],
  exports: [SyncService, MeiliSearchProvider],
})
export class SyncModule {}
