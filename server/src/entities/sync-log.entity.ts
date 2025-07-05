import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'sync_log' })
export class SyncLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  table_name: string;

  @Column()
  operation: 'INSERT' | 'UPDATE' | 'DELETE';

  @Column('uuid')
  record_id: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  occurred_at: Date;

  @Column({ default: false })
  processed: boolean;
}
