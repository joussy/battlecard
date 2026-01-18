import { Entity, Index, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @Index()
  @Column('bigint')
  expiredAt = Date.now();

  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  @Column('text')
  json: string;
}
